import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import { Pencil } from "tabler-icons-react";
import { EditingTodo, TodoEntry } from "~/types/todo";
import { api } from "~/utils/api";

type Props = {
  todo: TodoEntry;
  setEditingTodo: (todo: EditingTodo) => void;
};

const TodoItem: FC<Props> = ({ todo, setEditingTodo }) => {
  const { data: sessionData } = useSession();
  const utlis = api.useUtils();
  const deleteTodo = api.todo.delete.useMutation({
    onSettled: async () => {
      await utlis.todo.getAll.invalidate();
    },
  });
  return (
    <Card withBorder key={todo.id} mt={"sm"}>
      <Group>
        <Text>
          <Link href={`/items/${todo.id}`}>
            <span>{todo.title}</span>
          </Link>
        </Text>
        {sessionData?.user?.id === todo.owner.id && (
          <Group>
            <ActionIcon
              onClick={() => {
                deleteTodo.mutate({ id: todo.id });
              }}
              color="red"
              variant="transparent"
            ></ActionIcon>
            <ActionIcon
              onClick={() => {
                setEditingTodo(todo.id);
              }}
              variant="transparent">
                <Pencil size={18} />
              </ActionIcon>
          </Group>
        )}
      </Group>
    </Card>
  );
};
