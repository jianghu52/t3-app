import { ActionIcon, Card, Group, Text, TextInput } from "@mantine/core";
import { type NextPage } from "next";

import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";
import { Trash } from "tabler-icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm, zodResolver } from "@mantine/form";

const Todo: NextPage = () => {
  const { data: sessionData } = useSession();
  const form = useForm({
    mode: "uncontrolled",

    initialValues: {
      title: "",
      description: "",
    },
    //validate:zodResolver(createTodoSchema)
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
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => signOut() : () => signIn()}
        >
          {sessionData ? "Sign Out" : "Sign In"}
        </button>
        <form onSubmit={form.onSubmit((data) => {
            createTodo.mutate(data);
            form.reset();
          })}>
            <TextInput
              label="Title"
              placeholder="Enter title"
              {...form.getInputProps("title")}
            />
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
