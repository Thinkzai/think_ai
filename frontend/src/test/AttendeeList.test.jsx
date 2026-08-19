import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AttendeeList from "../components/liveStudio/AttendeeList";

const mockAttendees = [
  { id: "1", name: "Jane Smith", role: "Instructor", status: "online" },
  { id: "2", name: "Bob Johnson", role: "Learner", status: "online" },
  { id: "3", name: "Alice Brown", role: "Learner", status: "away" },
];

describe("AttendeeList", () => {
  it("renders no attendees message when empty", () => {
    render(<AttendeeList attendees={[]} />);
    expect(screen.getByText("No attendees yet")).toBeInTheDocument();
  });

  it("renders attendees grouped by role", () => {
    render(<AttendeeList attendees={mockAttendees} />);
    expect(screen.getByTestId("attendee-list")).toBeInTheDocument();
    expect(screen.getByText("Instructors (1)")).toBeInTheDocument();
    expect(screen.getByText("Students (2)")).toBeInTheDocument();
  });

  it("displays attendee names", () => {
    render(<AttendeeList attendees={mockAttendees} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("Alice Brown")).toBeInTheDocument();
  });

  it("displays attendee roles", () => {
    render(<AttendeeList attendees={mockAttendees} />);
    const roleElements = screen.getAllByText("Instructor");
    expect(roleElements.length).toBeGreaterThanOrEqual(1);
    const learnerRoles = screen.getAllByText("Learner");
    expect(learnerRoles.length).toBe(2);
  });

  it("shows first letter of name as avatar fallback", () => {
    render(<AttendeeList attendees={mockAttendees} />);
    expect(screen.getByText("J")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("displays online status indicator", () => {
    render(<AttendeeList attendees={mockAttendees} />);
    const statusIndicators = screen.getAllByRole("generic").filter(
      (el) => el.className.includes("rounded-full") && el.className.includes("bg-")
    );
    expect(statusIndicators.length).toBeGreaterThan(0);
  });
});
