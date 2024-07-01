import { api } from "~/utils/api";
import { type EditingTodo } from "../types/todo";
import { useForm, zodResolver } from "@mantine/form";
import { createTodoSchema } from "~/schema/todo";
import { FC, use, useEffect } from "react";
import { Group, TextInput, Textarea } from "@mantine/core";

type Props = {
    edtingTodo: EditingTodo;
}

const useTodoEdit = (editingTodoID: EditingTodo) => {
  const utils = api.useUtils();
  const form = useForm({
    initialValues: {
      id: null as number | null,
      title: "",
      description: "",
    },
    validate: zodResolver(createTodoSchema),
  });
  const { data } = api.todo.get.useQuery(
    { id: editingTodoID! },
    { enabled: editingTodoID != null },
  );

  useEffect(() => {
    if (data) {
      form.setValues(data);
    }
  }, [data?.id]);

  const createTodo = api.todo.create.useMutation({
    onSettled: async () => {
       await utils.todo.getAll.invalidate();

    },
  });

  const updateTodo = api.todo.update.useMutation({
    onSettled: async () => {
      await utils.todo.getAll.invalidate();
    },
  });
  return { form, createTodo, updateTodo };
};

const TodoEdit :FC<Props> = ({ edtingTodo }) => {
    const { form, createTodo, updateTodo } = useTodoEdit(edtingTodo);
    return (
        <form
        onSubmit={form.onSubmit((data)=> {
            if(data.id) {
                updateTodo.mutate(
                    {id:data.id,title:data.title,description:data.description}
                );
            } else {
                createTodo.mutate(data);
            }
            form.reset();
        })}
        >
            <TextInput
                label="Title"
                placeholder="Enter title"
                {...form.getInputProps("title")}
            />
            <Textarea
                label="Description"
                placeholder="Enter description"
                {...form.getInputProps("description")}
            />
            <Group >
                <button type="reset" onClick={form.reset}>Rest</button>
                <button type="submit">{form.values.id ? "Update task" : "Create task"}</button>
            </Group>
        </form>
    )
}

export default TodoEdit;