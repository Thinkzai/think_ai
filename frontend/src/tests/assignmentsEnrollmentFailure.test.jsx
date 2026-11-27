import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import AssignmentsPage from '../pages/learner/assessment/AssignmentsPage';
import { getMyEnrollments } from '../api/enrollmentApi';

vi.mock('../api/enrollmentApi', () => ({ getMyEnrollments: vi.fn() }));

it('shows a failed enrollment request honestly and retries before showing an empty result', async () => {
  getMyEnrollments.mockRejectedValueOnce({ response: { status: 500, data: { message: 'LMS service failed. Please try again.' } } });
  getMyEnrollments.mockResolvedValueOnce({ data: { success: true, data: [] } });
  render(<MemoryRouter><AssignmentsPage /></MemoryRouter>);
  expect(await screen.findByRole('alert')).toHaveTextContent('LMS service failed');
  expect(screen.queryByText('No Enrolled Courses Found')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByText('No Enrolled Courses Found')).toBeInTheDocument();
  await waitFor(() => expect(getMyEnrollments).toHaveBeenCalledTimes(2));
});
