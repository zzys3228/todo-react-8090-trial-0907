// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./Form";
import Todo from "./Todo";

afterEach(cleanup);

describe("WO-1 title length behavior", () => {
  it("shows a dedicated 0/100 count and native 100-unit limit for a new title", () => {
    render(<Form addTask={vi.fn()} />);

    const input = screen.getByRole("textbox", { name: /what needs to be done/i });
    const count = screen.getByText("0/100");

    expect(input.getAttribute("maxLength")).toBe("100");
    expect(input.getAttribute("aria-describedby")).toBe(count.id);
  });

  it("shows a dedicated 0/100 count and native 100-unit limit while editing", async () => {
    const user = userEvent.setup();
    render(
      <Todo
        id="todo-1"
        name="Task"
        completed={false}
        toggleTaskCompleted={vi.fn()}
        deleteTask={vi.fn()}
        editTask={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /edit task/i }));
    const input = screen.getByRole("textbox", { name: /new name for task/i });
    const count = screen.getByText("0/100");

    expect(input.getAttribute("maxLength")).toBe("100");
    expect(input.getAttribute("aria-describedby")).toBe(count.id);
  });

  it("defensively truncates an over-limit create value and re-arms its polite status", () => {
    render(<Form addTask={vi.fn()} />);
    const input = screen.getByRole("textbox", { name: /what needs to be done/i });
    const status = screen.getByRole("status");

    fireEvent.change(input, { target: { value: "😀" + "a".repeat(99) } });
    expect(input.value.length).toBe(100);
    expect(screen.getByText("100/100")).toBeTruthy();
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toMatch(/100/);

    fireEvent.change(input, { target: { value: "a".repeat(99) } });
    expect(status.textContent).toBe("");
    fireEvent.change(input, { target: { value: "a".repeat(101) } });
    expect(input.value).toBe("a".repeat(100));
    expect(status.textContent).toMatch(/100/);
  });

  it("keeps the baseline empty-title submit behavior", async () => {
    const user = userEvent.setup();
    const addTask = vi.fn();
    const editTask = vi.fn();
    render(<Form addTask={addTask} />);
    render(
      <Todo
        id="todo-2"
        name="Task"
        completed={false}
        toggleTaskCompleted={vi.fn()}
        deleteTask={vi.fn()}
        editTask={editTask}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: /edit task/i }));
    await user.click(screen.getByRole("button", { name: /save new name for task/i }));

    expect(addTask).toHaveBeenCalledWith("");
    expect(editTask).toHaveBeenCalledWith("todo-2", "");
  });
});
