import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Loader,
  Center,
  Badge,
  Group,
  Button,
  ActionIcon,
  Stack,
  Pagination,
  Select,
  LoadingOverlay,
  Box,
  ThemeIcon,
  Paper,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { getTasks, deleteTask, type TaskData } from "../services/tasks";
import { AddTaskModal } from "../components/modals/AddTaskModal";
import { UpdateStatusModal } from "../components/modals/UpdateStatusModal";
import { IconTrash, IconEdit, IconPlus, IconClipboardList } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

interface Task extends TaskData {
  status?: "PENDING" | "IN_PROGRESS" | "DONE";
}

export default function Tasks() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");

  const [opened, { open, close }] = useDisclosure(false);
  const [statusOpened, { open: openStatus, close: closeStatus }] =
    useDisclosure(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    data: tasksData,
    isLoading,
    isError,
    error,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: ["tasks", page, limit],
    queryFn: async () => {
      const response = await getTasks(page, limit);
      return response.data;
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      notifications.show({
        title: "Task Deleted",
        message: "The task has been removed successfully.",
        color: "teal",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: "Failed to delete the task.",
        color: "red",
      });
      console.error(err);
    },
  });

  const confirmDelete = (task: Task) => {
    const taskId = task.id;
    if (!taskId) return;

    modals.openConfirmModal({
      title: "Delete task",
      children: (
        <Text size="sm">
          Are you sure you want to delete <b>{task.title}</b>? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate(taskId),
    });
  };

  const handleUpdateStatus = (task: Task) => {
    setSelectedTask(task);
    openStatus();
  };

  useEffect(() => {
    if (tasksData?.data?.pagination) {
      const { totalPages } = tasksData.data.pagination;
      if (page > totalPages && totalPages > 0) {
        setSearchParams({ page: totalPages.toString(), limit: limit.toString() });
      }
    }
  }, [tasksData, page, limit, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (newLimit) {
      setSearchParams({ page: "1", limit: newLimit });
    }
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "DONE":
        return { color: "teal", label: "Completed" };
      case "IN_PROGRESS":
        return { color: "blue", label: "In Progress" };
      default:
        return { color: "gray", label: "Pending" };
    }
  };

  const tasks: Task[] = tasksData?.data?.tasks || [];
  const pagination = tasksData?.data?.pagination || {
    totalPages: 1,
    currentPage: 1,
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" type="dots" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Container mt="xl">
        <Paper p="xl" withBorder radius="md" bg="red.0">
          <Group>
            <ThemeIcon color="red" size="lg" radius="xl" variant="light">
              <IconTrash size={20} />
            </ThemeIcon>
            <Box>
               <Text c="red.9" fw={700}>Error loading tasks</Text>
               <Text c="red.7" size="sm">{error instanceof Error ? error.message : "Failed to fetch tasks"}</Text>
            </Box>
          </Group>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb={40} align="end">
        <div>
           <Title order={1} style={{ fontFamily: "var(--font-outfit)", fontWeight: 700 }}>
            My Workspace
           </Title>
           <Text c="dimmed" mt={5}>Manage your tasks and track progress</Text>
        </div>
        <Button 
          leftSection={<IconPlus size={18} />} 
          onClick={open}
          size="md"
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan' }}
          className="hover-lift"
        >
          New Task
        </Button>
      </Group>

      {tasks.length === 0 && !isFetching ? (
        <Paper p={60} radius="md" withBorder style={{ textAlign: 'center', borderStyle: 'dashed' }}>
           <ThemeIcon size={80} radius={100} variant="light" color="gray" mb="xl">
              <IconClipboardList size={40} />
           </ThemeIcon>
           <Title order={3} mb="sm">No tasks found</Title>
           <Text c="dimmed" maw={400} mx="auto" mb="xl">
             You don't have any tasks yet. Create one to get started and stay organized.
           </Text>
           <Button variant="light" onClick={open} leftSection={<IconPlus size={16} />}>Create First Task</Button>
        </Paper>
      ) : (
        <>
          <Box pos="relative" mih={200}>
            <LoadingOverlay
              visible={isFetching}
              overlayProps={{ blur: 2, backgroundOpacity: 0.1 }}
              loaderProps={{ type: "dots", size: "xl" }}
              zIndex={10}
            />
            <Grid gutter="lg">
              {tasks.map((task) => {
                const statusConfig = getStatusConfig(task.status);
                return (
                  <Grid.Col key={task.id} span={{ base: 12, sm: 6, md: 4 }}>
                    <Card 
                      padding="lg" 
                      radius="md" 
                      withBorder
                      h="100%"
                      style={{ 
                          borderLeft: `4px solid var(--mantine-color-${statusConfig.color}-filled)`,
                      }}
                    >
                        <Stack justify="space-between" h="100%" gap="md">
                          <div>
                            <Group justify="space-between" mb="xs" wrap="nowrap" align="start">
                              <Text fw={600} size="lg" lineClamp={1} style={{flex: 1}} title={task.title}>
                                {task.title}
                              </Text>
                              <Badge
                                color={statusConfig.color}
                                variant="light"
                                radius="sm"
                              >
                                {statusConfig.label}
                              </Badge>
                            </Group>

                            <Text size="sm" c="dimmed" lineClamp={3} style={{ lineHeight: 1.6 }}>
                              {task.description || "No description provided."}
                            </Text>
                          </div>

                          <Group justify="flex-end" gap={8} pt="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-1)' }}>
                            <Tooltip label="Update Status">
                              <ActionIcon
                                variant="subtle"
                                color="gray"
                                onClick={() => handleUpdateStatus(task)}
                                size="lg"
                              >
                                <IconEdit size={18} />
                              </ActionIcon>
                            </Tooltip>
                            
                            <Tooltip label="Delete Task">
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => confirmDelete(task)}
                                loading={
                                  deleteMutation.isLoading &&
                                  deleteMutation.variables === task.id
                                }
                                size="lg"
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Stack>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Box>

          <Group justify="space-between" mt={40} align="center" wrap="wrap" gap="md">
             <Text size="sm" c="dimmed">
               Showing {tasks.length} tasks
             </Text>
             <Group gap="md">
                <Pagination
                  total={pagination.totalPages}
                  value={pagination.currentPage}
                  onChange={handlePageChange}
                  disabled={isPreviousData}
                  radius="md"
                  color="indigo"
                />
                <Select
                  size="sm"
                  w={80}
                  data={["3", "6", "9", "12", "15"]}
                  value={limit.toString()}
                  onChange={handleLimitChange}
                  allowDeselect={false}
                />
             </Group>
          </Group>
        </>
      )}

      <AddTaskModal opened={opened} onClose={close} />

      <UpdateStatusModal
        opened={statusOpened}
        onClose={closeStatus}
        taskId={selectedTask?.id ?? null}
        currentStatus={selectedTask?.status}
      />
    </Container>
  );
}
