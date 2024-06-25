import { ActionIcon, Button, Card, Group, Text, TextInput } from "@mantine/core";
import { type NextPage } from "next";

import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";
import { Trash } from "tabler-icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm, zodResolver } from "@mantine/form";
import { createTodoSchema } from "~/schema/todo";

const Todo: NextPage = () => {
  const { data: sessionData } = useSession();
  const form = useForm({
    mode: "uncontrolled",

    initialValues: {
      title: "",
      description: "",
    },
    validate:zodResolver(createTodoSchema)
  });
  const createTodo = api.todo.create.useMutation();
  const todos = api.todo.getAll.useQuery();
  const deletetodo = api.todo.delete.useMutation();

 
  return (
    <Layout tile="Todo App">
      <h1>Todo App</h1>
      
      <div>
        <p className="text-center text-2xl text-white">
          {sessionData && <span>Logged in as {sessionData.user.name}</span>}
        </p>
        <Button 
          color="rgba(237, 109, 109, 1)"
          onClick={sessionData ? () => signOut() : () => signIn()}
        >
            
          {sessionData ? "Sign Out" : "Sign In"}
        </Button >
        <form onSubmit={form.onSubmit((data) => {
            createTodo.mutate(data);
            form.reset();
          })}>
            <TextInput
              label="Title"
              placeholder="Enter title"
              {...form.getInputProps("title")}
            />
            <TextInput
              label="Description"
              placeholder="Enter description"
              {...form.getInputProps("description")}
            />
            <button type="submit" className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              New Task
            </button>
          </form>
        {todos.data?.map((todo) => (
          <Card withBorder key={todo.id} mt={"sm"}>
            <Group>
              <Text>{todo.title}</Text>
              <ActionIcon
                onClick={() => deletetodo.mutate({ id: todo.id })}
                color="red"
                variant="transparent"
              >
                <Trash />
                Delete
              </ActionIcon>
            </Group>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Todo;
