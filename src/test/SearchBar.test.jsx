import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../components/SearchBar'

describe('SearchBar Component', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    onClear: vi.fn(),
    placeholder: 'Search jobs...'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default placeholder when no placeholder prop provided', () => {
    const { placeholder, ...propsWithoutPlaceholder } = defaultProps
    render(<SearchBar {...propsWithoutPlaceholder} />)
    
    expect(screen.getByPlaceholderText('🔍 Start typing to search...')).toBeInTheDocument()
  })

  it('renders with custom placeholder when provided', () => {
    render(<SearchBar {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('Search jobs...')).toBeInTheDocument()
  })

  it('displays the correct value', () => {
    render(<SearchBar {...defaultProps} value="React Developer" />)
    
    expect(screen.getByDisplayValue('React Developer')).toBeInTheDocument()
  })

  it('calls onChange when user types in the search input', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...defaultProps} />)
    
    const searchInput = screen.getByRole('combobox')
    await user.type(searchInput, 'Frontend')
    
    expect(defaultProps.onChange).toHaveBeenCalledTimes(8) // 'Frontend' = 8 characters
  })

  it('calls onSubmit when form is submitted', async () => {
    render(<SearchBar {...defaultProps} value="React" />)
    
    const form = screen.getByRole('combobox').closest('form')
    fireEvent.submit(form)
    
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows clear button when there is a value', () => {
    render(<SearchBar {...defaultProps} value="React" />)
    
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchBar {...defaultProps} value="" />)
    
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...defaultProps} value="React" />)
    
    const clearButton = screen.getByRole('button', { name: /clear search/i })
    await user.click(clearButton)
    
    expect(defaultProps.onClear).toHaveBeenCalledTimes(1)
  })

  it('has proper ARIA attributes for accessibility', () => {
    render(<SearchBar {...defaultProps} />)
    
    const searchInput = screen.getByRole('combobox')
    expect(searchInput).toHaveAttribute('aria-label', 'Search for jobs')
    expect(searchInput).toHaveAttribute('aria-describedby', 'search-help')
    
    expect(screen.getByText('Search by job title, company, location, or job type')).toHaveClass('sr-only')
  })

  it('includes datalist with search suggestions', () => {
    render(<SearchBar {...defaultProps} />)
    
    // Check for datalist element
    const datalist = document.getElementById('search-suggestions')
    expect(datalist).toBeInTheDocument()
    
    // Check for some expected option elements
    const options = datalist.querySelectorAll('option')
    expect(options).toHaveLength(5)
    expect(options[0]).toHaveAttribute('value', 'React')
    expect(options[1]).toHaveAttribute('value', 'Frontend')
    expect(options[4]).toHaveAttribute('value', 'Remote')
  })

  it('applies correct CSS classes for styling', () => {
    render(<SearchBar {...defaultProps} />)
    
    const searchInput = screen.getByRole('combobox')
    expect(searchInput).toHaveClass('rounded-full')
    expect(searchInput).toHaveClass('shadow-lg')
    expect(searchInput).toHaveClass('focus:ring-2')
  })

  it('prevents default form submission behavior', async () => {
    const mockOnSubmit = vi.fn()
    render(<SearchBar {...defaultProps} onSubmit={mockOnSubmit} />)
    
    const form = screen.getByRole('combobox').closest('form')
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    
    fireEvent(form, submitEvent)
    
    expect(submitEvent.defaultPrevented).toBe(true)
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation properly', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...defaultProps} value="test" />)
    
    const searchInput = screen.getByRole('combobox')
    searchInput.focus()
    
    // Test Enter key submission
    await user.keyboard('{Enter}')
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('maintains focus state correctly', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...defaultProps} />)
    
    const searchInput = screen.getByRole('combobox')
    await user.click(searchInput)
    
    expect(searchInput).toHaveFocus()
  })
})