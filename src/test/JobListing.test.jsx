import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JobListing from '../components/JobListing'
import { renderWithRouter, mockJob } from './utils.jsx'

describe('JobListing Component', () => {
  it('renders job information correctly', () => {
    renderWithRouter(<JobListing job={mockJob} />)
    
    expect(screen.getByText(mockJob.title)).toBeInTheDocument()
    expect(screen.getByText(mockJob.type)).toBeInTheDocument()
    expect(screen.getByText(mockJob.salary)).toBeInTheDocument()
    expect(screen.getByText(mockJob.location)).toBeInTheDocument()
  })

  it('displays truncated description by default', () => {
    const longDescriptionJob = {
      ...mockJob,
      description: 'This is a very long job description that should be truncated after 90 characters to maintain layout consistency and readability for users browsing through multiple job listings'
    }
    
    renderWithRouter(<JobListing job={longDescriptionJob} />)
    
    // Should show truncated version
    expect(screen.getByText(/This is a very long job description that should be truncated after 90 charac.../)).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('shows full description when "More" button is clicked', async () => {
    const user = userEvent.setup()
    const longDescriptionJob = {
      ...mockJob,
      description: 'This is a very long job description that should be truncated after 90 characters to maintain layout consistency and readability for users browsing through multiple job listings'
    }
    
    renderWithRouter(<JobListing job={longDescriptionJob} />)
    
    const moreButton = screen.getByText('More')
    await user.click(moreButton)
    
    expect(screen.getByText(longDescriptionJob.description)).toBeInTheDocument()
    expect(screen.getByText('Less')).toBeInTheDocument()
  })

  it('toggles between More and Less buttons correctly', async () => {
    const user = userEvent.setup()
    const longDescriptionJob = {
      ...mockJob,
      description: 'This is a very long job description that should be truncated after 90 characters because it exceeds the character limit'
    }
    
    renderWithRouter(<JobListing job={longDescriptionJob} />)
    
    // Initial state - should show "More"
    expect(screen.getByText('More')).toBeInTheDocument()
    
    // Click More
    await user.click(screen.getByText('More'))
    expect(screen.getByText('Less')).toBeInTheDocument()
    
    // Click Less
    await user.click(screen.getByText('Less'))
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('does not show More/Less button for short descriptions', () => {
    const shortDescriptionJob = {
      ...mockJob,
      description: 'Short description'
    }
    
    renderWithRouter(<JobListing job={shortDescriptionJob} />)
    
    expect(screen.queryByText('More')).not.toBeInTheDocument()
    expect(screen.queryByText('Less')).not.toBeInTheDocument()
  })

  it('renders "Read More" link with correct URL', () => {
    renderWithRouter(<JobListing job={mockJob} />)
    
    const readMoreLink = screen.getByRole('link', { name: /read more/i })
    expect(readMoreLink).toHaveAttribute('href', `/jobs/${mockJob.id}`)
  })

  it('displays location with map marker icon', () => {
    renderWithRouter(<JobListing job={mockJob} />)
    
    // Check for location text
    expect(screen.getByText(mockJob.location)).toBeInTheDocument()
    
    // Check that the location text is in a container with the correct class
    const locationText = screen.getByText(mockJob.location)
    const locationContainer = locationText.parentElement
    expect(locationContainer).toHaveClass('text-orange-700')
  })

  it('handles missing job data gracefully', () => {
    const incompleteJob = {
      id: '1',
      title: 'Test Job',
      // Missing other fields
    }
    
    renderWithRouter(<JobListing job={incompleteJob} />)
    
    expect(screen.getByText('Test Job')).toBeInTheDocument()
    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    renderWithRouter(<JobListing job={mockJob} />)
    
    const jobCard = screen.getByText(mockJob.title).closest('.bg-white')
    expect(jobCard).toHaveClass('bg-white', 'rounded-xl', 'shadow-md', 'relative')
  })

  it('logs job data for debugging', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    renderWithRouter(<JobListing job={mockJob} />)
    
    expect(consoleSpy).toHaveBeenCalledWith('Job data:', mockJob)
    
    consoleSpy.mockRestore()
  })

  it('has proper semantic structure', () => {
    renderWithRouter(<JobListing job={mockJob} />)
    
    // Check for main job title heading
    expect(screen.getByRole('heading', { name: mockJob.title })).toBeInTheDocument()
    
    // Check for link
    expect(screen.getByRole('link', { name: /read more/i })).toBeInTheDocument()
  })

  it('handles click events properly', async () => {
    const user = userEvent.setup()
    const longDescriptionJob = {
      ...mockJob,
      description: 'We are seeking a talented Front-End Developer to join our team in Boston, MA. This position requires extensive experience with React and modern JavaScript frameworks.'
    }
    renderWithRouter(<JobListing job={longDescriptionJob} />)
    
    const moreButton = screen.getByText('More')
    
    // Should be clickable
    expect(moreButton).toBeInTheDocument()
    await user.click(moreButton)
    
    // State should change
    expect(screen.getByText('Less')).toBeInTheDocument()
  })
})