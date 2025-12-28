import { Modal, Select, Stack, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, type UpdateTaskStatus } from "../../services/tasks";
import { useEffect } from "react";

interface UpdateStatusModalProps {
  opened: boolean;
  onClose: () => void;
  taskId: string | null;
  currentStatus?: "PENDING" | "IN_PROGRESS" | "DONE";
}

export function UpdateStatusModal({
  opened,
  onClose,
  taskId,
  currentStatus,
}: UpdateStatusModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateTaskStatus>({
    initialValues: {
      status: "PENDING",
    },
    validate: {
      status: (value) => (value ? null : "Status is required"),
    },
  });

  useEffect(() => {
    if (currentStatus) {
      form.setValues({ status: currentStatus });
    }
  }, [currentStatus]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskStatus }) =>
      updateTask(id, data),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Status updated successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: "Failed to update status",
        color: "red",
      });
      console.error(err);
    },
  });

  const handleUpdate = (values: UpdateTaskStatus) => {
    if (taskId) {
      updateMutation.mutate({ id: taskId, data: values });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Update Task Status"
      centered
    >
      <form onSubmit={form.onSubmit(handleUpdate)}>
        <Stack>
          <Select
            label="Status"
            placeholder="Select status"
            withAsterisk
            data={[
              { value: "PENDING", label: "Pending" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "DONE", label: "Done" },
            ]}
            {...form.getInputProps("status")}
          />
          <Button
            type="submit"
            loading={updateMutation.isLoading}
            fullWidth
            mt="md"
          >
            Update Status
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
