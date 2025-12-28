import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Loader,
  Alert,
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { getTasks, deleteTask, type TaskData } from "../services/tasks";
import { AddTaskModal } from "../components/modals/AddTaskModal";
import { UpdateStatusModal } from "../components/modals/UpdateStatusModal";
import { IconTrash, IconEdit } from "@tabler/icons-react";
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
        color: "green",
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
      centered: true,
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "DONE":
        return "green";
      case "IN_PROGRESS":
        return "orange";
      default:
        return "blue";
    }
  };

  const tasks: Task[] = tasksData?.data?.tasks || [];
  const pagination = tasksData?.data?.pagination || {
    totalPages: 1,
    currentPage: 1,
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Container mt="xl">
        <Alert color="red" title="Error">
          {error instanceof Error ? error.message : "Failed to fetch tasks"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>My Tasks</Title>
        <Button onClick={open}>Add Task</Button>
      </Group>

      {tasks.length === 0 && !isFetching ? (
        <Text ta="center" c="dimmed" size="lg">
          No tasks found.
        </Text>
      ) : (
        <>
          <Box pos="relative">
            <LoadingOverlay
              visible={isFetching}
              overlayProps={{ blur: 1 }}
              loaderProps={{ size: "lg" }}
            />
            <Grid>
              {tasks.map((task) => (
                <Grid.Col key={task.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                    <Stack justify="space-between" h="100%">
                      <div>
                        <Group justify="space-between" mb="xs" wrap="nowrap">
                          <Text fw={500} truncate="end" style={{ flex: 1 }}>
                            {task.title}
                          </Text>
                          <Group gap={5}>
                            <Badge
                              color={getStatusColor(task.status)}
                              variant="light"
                            >
                              {task.status}
                            </Badge>
                          </Group>
                        </Group>

                        <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                          {task.description}
                        </Text>
                      </div>

                      <Group justify="flex-end" gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleUpdateStatus(task)}
                          title="Update status"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => confirmDelete(task)}
                          loading={
                            deleteMutation.isPending &&
                            deleteMutation.variables === task.id
                          }
                          title="Delete task"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Group justify="center" mt="xl" gap="md">
            <Pagination
              total={pagination.totalPages}
              value={pagination.currentPage}
              onChange={handlePageChange}
              disabled={isPreviousData}
            />
            <Select
              size="xs"
              w={80}
              data={["3", "6", "9", "12"]}
              value={limit.toString()}
              onChange={handleLimitChange}
              placeholder="Limit"
            />
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
