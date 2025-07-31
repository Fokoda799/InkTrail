import WriteBlog from "../pages/WriteBlog";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof WriteBlog> = {
  title: "Pages/WriteBlog",
  component: WriteBlog,
};

export default meta;

type Story = StoryObj<typeof WriteBlog>;

export const Default: Story = {
  args: {
    // Provide default args for the story
  },
};
