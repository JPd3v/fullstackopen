/* eslint-disable no-undef */
import Blog from "./Blog";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<Blog/>", () => {
  const blogMock = {
    title: "a blog for testing",
    author: "a test",
    url: "www.testing.com",
    likes: 1,
    user: "tester",
    id: "123456",
  };

  test("blog should only render title and author by default", () => {
    render(<Blog blog={blogMock} />);

    const blogTitle = screen.getByText("a blog for testing");
    const blogAuthor = screen.getByText("a test");
    const url = screen.queryByText("www.testing.com");
    const likes = screen.queryByText("1");

    expect(blogTitle).toBeDefined();
    expect(blogAuthor).toBeDefined();
    expect(url).not.toBeInTheDocument();
    expect(likes).not.toBeInTheDocument();
  });

  test("url and likes renders when button is clicked", async () => {
    const user = await userEvent.setup();

    render(<Blog blog={blogMock} />);

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const url = screen.queryByText("www.testing.com");
    const likes = screen.queryByText("likes:1");

    expect(url).toBeInTheDocument();
    expect(likes).toBeInTheDocument();
  });

  test("like button is called as expected", async () => {
    const likeMock = jest.fn();
    const user = userEvent.setup();
    render(<Blog blog={blogMock} handleLike={likeMock} />);

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeMock).toHaveBeenCalledTimes(2);
  });
});
