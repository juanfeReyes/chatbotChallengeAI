import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ChatModal from './chat';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { reply: 'AI reply' } }))
  }
}));

vi.mock('../hook/useLocalStorage', () => {
  return {
    __esModule: true,
    default: (key: string, initial: any) => [initial, vi.fn()]
  };
});

describe('ChatModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<ChatModal isOpen={false} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders chat UI when open', () => {
    render(<ChatModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText('Chat Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it.skip('calls onClose when close button is clicked', () => {
    render(<ChatModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it.skip('sends a message and displays AI reply', async () => {
    render(<ChatModal isOpen={true} onClose={onClose} />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    await act( () => fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' }))
    await waitFor(() => expect(screen.getByText('AI reply')).toBeInTheDocument());
  });

  it.skip('disables input and button when loading', async () => {
    render(<ChatModal isOpen={true} onClose={onClose} />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(input).toBeDisabled();
    expect(screen.getByTestId('send-btn')).toBeDisabled();
  });
});
