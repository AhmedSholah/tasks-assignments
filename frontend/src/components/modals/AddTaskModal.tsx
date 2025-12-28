import { Modal, TextInput, Textarea, Stack, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../services/tasks";

interface AddTaskModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AddTaskModal({ opened, onClose }: AddTaskModalProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
    },
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Task created successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
      form.reset();
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: "Failed to create task",
        color: "red",
      });
      console.error(err);
    },
  });

  const handleCreateTask = (values: typeof form.values) => {
    createMutation.mutate(values as any);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create New Task" centered>
      <form onSubmit={form.onSubmit(handleCreateTask)}>
        <Stack>
          <TextInput
            label="Task Title"
            placeholder="Enter task title"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Enter task description (optional)"
            minRows={3}
            maxRows={5}
            {...form.getInputProps("description")}
          />
          <Button
            type="submit"
            loading={createMutation.isLoading}
            fullWidth
            mt="md"
          >
            Create Task
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
