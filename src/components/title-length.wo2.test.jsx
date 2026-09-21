// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./Form";
import Todo from "./Todo";

afterEach(cleanup);

function renderTodo(id = "todo-1", name = "Task") {
  const editTask = vi.fn();
  const result = render(
    <Todo
      id={id}
      name={name}
      completed={false}
      toggleTaskCompleted={vi.fn()}
      deleteTask={vi.fn()}
      editTask={editTask}
    />,
  );
  return { ...result, editTask };
}

describe("WO-2 title-length acceptance coverage", () => {
  it("counts a surrogate pair as two UTF-16 units on create and edit", async () => {
    const user = userEvent.setup();
    render(<Form addTask={vi.fn()} />);
    renderTodo();

    const create = screen.getByRole("textbox", { name: /what needs to be done/i });
    fireEvent.change(create, { target: { value: "😀" + "a".repeat(98) } });
    expect(create.value.length).toBe(100);
    expect(screen.getByText("100/100")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /edit task/i }));
    const edit = screen.getByRole("textbox", { name: /new name for task/i });
    fireEvent.change(edit, { target: { value: "😀" + "b".repeat(98) } });
    expect(edit.value.length).toBe(100);
    expect(screen.getAllByText("100/100")).toHaveLength(2);
  });

  it("defensively truncates over-limit values at both input boundaries", async () => {
    const user = userEvent.setup();
    render(<Form addTask={vi.fn()} />);
    renderTodo();

    const create = screen.getByRole("textbox", { name: /what needs to be done/i });
    expect(create.maxLength).toBe(100);
    fireEvent.change(create, { target: { value: "a".repeat(101) } });
    expect(create.value).toBe("a".repeat(100));

    await user.click(screen.getByRole("button", { name: /edit task/i }));
    const edit = screen.getByRole("textbox", { name: /new name for task/i });
    expect(edit.maxLength).toBe(100);
    fireEvent.change(edit, { target: { value: "b".repeat(101) } });
    expect(edit.value).toBe("b".repeat(100));
  });

  it("gives two simultaneously edited tasks independent descriptions and status regions", async () => {
    const user = userEvent.setup();
    renderTodo("todo-1", "First");
    renderTodo("todo-2", "Second");
    await user.click(screen.getByRole("button", { name: /edit first/i }));
    await user.click(screen.getByRole("button", { name: /edit second/i }));

    const first = screen.getByRole("textbox", { name: /new name for first/i });
    const second = screen.getByRole("textbox", { name: /new name for second/i });
    expect(first.getAttribute("aria-describedby")).toBe("todo-1-counter");
    expect(second.getAttribute("aria-describedby")).toBe("todo-2-counter");
    expect(document.getElementById("todo-1-counter").textContent).toBe("0/100");
    expect(document.getElementById("todo-2-counter").textContent).toBe("0/100");
    const firstStatus = document.getElementById("todo-1-limit-status");
    const secondStatus = document.getElementById("todo-2-limit-status");
    expect(firstStatus.getAttribute("role")).toBe("status");
    expect(secondStatus.getAttribute("aria-live")).toBe("polite");

    fireEvent.change(first, { target: { value: "a".repeat(100) } });
    expect(firstStatus.textContent).toMatch(/100/);
    expect(secondStatus.textContent).toBe("");
    expect(document.getElementById("todo-2-counter").textContent).toBe("0/100");
  });

  it("re-arms the edit announcement only after leaving the limit", async () => {
    const user = userEvent.setup();
    renderTodo();
    await user.click(screen.getByRole("button", { name: /edit task/i }));
    const edit = screen.getByRole("textbox", { name: /new name for task/i });
    const status = screen.getByRole("status");

    fireEvent.change(edit, { target: { value: "a".repeat(100) } });
    expect(status.textContent).toMatch(/100/);
    const firstMessage = status.textContent;
    fireEvent.change(edit, { target: { value: "b".repeat(100) } });
    expect(status.textContent).toBe(firstMessage);
    expect(within(status).queryAllByText(/100/)).toHaveLength(1);
    fireEvent.change(edit, { target: { value: "b".repeat(99) } });
    expect(status.textContent).toBe("");
    fireEvent.change(edit, { target: { value: "b".repeat(100) } });
    expect(status.textContent).toBe(firstMessage);
  });

  it("preserves empty creation and edit saving with an empty count", async () => {
    const user = userEvent.setup();
    const addTask = vi.fn();
    render(<Form addTask={addTask} />);
    const { editTask } = renderTodo();

    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(addTask).toHaveBeenCalledWith("");
    expect(document.getElementById("new-todo-input-counter").textContent).toBe("0/100");
    await user.click(screen.getByRole("button", { name: /edit task/i }));
    expect(document.getElementById("todo-1-counter").textContent).toBe("0/100");
    await user.click(screen.getByRole("button", { name: /save new name/i }));
    expect(editTask).toHaveBeenCalledWith("todo-1", "");
  });
});
