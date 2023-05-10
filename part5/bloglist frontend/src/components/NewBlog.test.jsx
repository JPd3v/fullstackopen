/* eslint-disable no-undef */
import NewBlog from "./NewBlog";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<NewBlog/>", () => {
  test("calls the new blog event handler with right data", async () => {
    const handleNewBlogMock = jest.fn();
    const { container } = render(<NewBlog handleNewBlog={handleNewBlogMock} />);
    const user = userEvent.setup();

    const titleInput = container.querySelector("#title");
    const authorInput = container.querySelector("#author");
    const urlInput = container.querySelector("#url");

    const titleUserInput = "title input tested";
    const authorUserInput = "author input tested";
    const urlUserInput = "url input tested";

    await user.type(titleInput, titleUserInput);
    await user.type(authorInput, authorUserInput);
    await user.type(urlInput, urlUserInput);

    const createButton = screen.getByText("create");
    await user.click(createButton);

    expect(handleNewBlogMock).toBeCalledTimes(1);
    expect(handleNewBlogMock).toBeCalledWith(
      titleUserInput,
      authorUserInput,
      urlUserInput
    );
  });
});
