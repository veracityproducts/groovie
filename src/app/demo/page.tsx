'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import AltButton from '@/shared/components/ui/shadcn-studio/button/alt-button';
import { StitchesButton } from '@/shared/components/ui/shadcn-studio/button';
import { StitchedTabs } from '@/shared/components/ui/shadcn-studio/tabs';
import { ChatDisplay } from '@/features/chat';
import { ModeToggle } from '@/features/chat';
import { MessageList } from '@/features/chat';
import { ChatInput } from '@/features/chat';
import { ConversationSidebar } from '@/features/chat';
import { CHAT_MODES } from '@/features/chat';
import type { ChatMode, Message, Conversation } from '@/features/chat';

// Sample data
const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is photosynthesis?',
    createdAt: new Date(Date.now() - 5000),
    mode: 'reading-resource',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy.',
    createdAt: new Date(Date.now() - 3000),
    mode: 'reading-resource',
  },
  {
    id: '3',
    role: 'user',
    content: 'Can you explain it in simpler terms?',
    createdAt: new Date(Date.now() - 1000),
    mode: 'reading-resource',
  },
];

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    userId: 'demo-user',
    title: 'Photosynthesis Discussion',
    mode: 'reading-resource',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 5000),
    messages: SAMPLE_MESSAGES,
  },
  {
    id: '2',
    userId: 'demo-user',
    title: 'Math Help Session',
    mode: 'teaching-assistant',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    messages: [],
  },
  {
    id: '3',
    userId: 'demo-user',
    title: 'Research Notes',
    mode: 'magic-librarian',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 259200000),
    messages: [],
  },
];

const DEMO_SECTIONS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'chat-components', label: 'Chat Components' },
];

export default function DemoPage() {
  const [activeSection, setActiveSection] = useState<string>('buttons');
  const [currentMode, setCurrentMode] = useState<ChatMode>('reading-resource');
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      role: 'user',
      content,
      createdAt: new Date(),
      mode: currentMode,
    };
    setMessages([...messages, newMessage]);
    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(messages.length + 2),
        role: 'assistant',
        content: 'This is a demo response from the assistant.',
        createdAt: new Date(),
        mode: currentMode,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const modeConfigs = CHAT_MODES;

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Navigation */}
      <nav className='sticky top-0 z-10 border-b border-border bg-background'>
        <div className='mx-auto flex max-w-7xl items-center gap-6 px-4 py-4'>
          <h1 className='text-2xl font-bold'>Component Demo</h1>
          <div className='flex gap-2'>
            {DEMO_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className='mx-auto max-w-7xl px-4 py-8'>
        {/* Buttons Section */}
        {activeSection === 'buttons' && (
          <div className='space-y-12'>
            {/* Basic Button */}
            <section className='space-y-4'>
              <div>
                <h2 className='text-xl font-bold'>Basic Button</h2>
                <p className='text-sm text-muted-foreground'>
                  Standard button component with variants and sizes
                </p>
              </div>

              {/* Default Variant */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Default Variant</h3>
                <div className='flex flex-wrap gap-4'>
                  <Button size='sm'>Small</Button>
                  <Button size='md'>Medium</Button>
                  <Button size='lg'>Large</Button>
                </div>
              </div>

              {/* Outline Variant */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Outline Variant</h3>
                <div className='flex flex-wrap gap-4'>
                  <Button variant='outline' size='sm'>
                    Small
                  </Button>
                  <Button variant='outline' size='md'>
                    Medium
                  </Button>
                  <Button variant='outline' size='lg'>
                    Large
                  </Button>
                </div>
              </div>

              {/* Ghost Variant */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Ghost Variant</h3>
                <div className='flex flex-wrap gap-4'>
                  <Button variant='ghost' size='sm'>
                    Small
                  </Button>
                  <Button variant='ghost' size='md'>
                    Medium
                  </Button>
                  <Button variant='ghost' size='lg'>
                    Large
                  </Button>
                </div>
              </div>

              {/* Disabled State */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Disabled State</h3>
                <div className='flex flex-wrap gap-4'>
                  <Button disabled>Disabled Default</Button>
                  <Button variant='outline' disabled>
                    Disabled Outline
                  </Button>
                  <Button variant='ghost' disabled>
                    Disabled Ghost
                  </Button>
                </div>
              </div>
            </section>

            {/* Stitches Button */}
            <section className='space-y-4'>
              <div>
                <h2 className='text-xl font-bold'>Stitches Button</h2>
                <p className='text-sm text-muted-foreground'>
                  Interactive button with spring animation, variants, sizes, and states
                </p>
              </div>

              {/* Variants */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Color Variants</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Four color options: primary, secondary, accent, and muted
                </p>
                <div className='flex flex-wrap gap-4'>
                  <StitchesButton variant='primary'>Primary</StitchesButton>
                  <StitchesButton variant='secondary'>Secondary</StitchesButton>
                  <StitchesButton variant='accent'>Accent</StitchesButton>
                  <StitchesButton variant='muted'>Muted</StitchesButton>
                </div>
              </div>

              {/* Sizes */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Sizes</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Three size options: small, medium (default), and large
                </p>
                <div className='flex flex-wrap items-center gap-4'>
                  <StitchesButton size='sm'>Small</StitchesButton>
                  <StitchesButton size='md'>Medium</StitchesButton>
                  <StitchesButton size='lg'>Large</StitchesButton>
                </div>
              </div>

              {/* Combined Variants and Sizes */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Variant + Size Combinations</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Mix and match variants with different sizes
                </p>
                <div className='space-y-4'>
                  <div>
                    <p className='text-xs font-medium text-muted-foreground mb-2'>Primary</p>
                    <div className='flex flex-wrap gap-3'>
                      <StitchesButton variant='primary' size='sm'>Small</StitchesButton>
                      <StitchesButton variant='primary' size='md'>Medium</StitchesButton>
                      <StitchesButton variant='primary' size='lg'>Large</StitchesButton>
                    </div>
                  </div>
                  <div>
                    <p className='text-xs font-medium text-muted-foreground mb-2'>Secondary</p>
                    <div className='flex flex-wrap gap-3'>
                      <StitchesButton variant='secondary' size='sm'>Small</StitchesButton>
                      <StitchesButton variant='secondary' size='md'>Medium</StitchesButton>
                      <StitchesButton variant='secondary' size='lg'>Large</StitchesButton>
                    </div>
                  </div>
                  <div>
                    <p className='text-xs font-medium text-muted-foreground mb-2'>Accent</p>
                    <div className='flex flex-wrap gap-3'>
                      <StitchesButton variant='accent' size='sm'>Small</StitchesButton>
                      <StitchesButton variant='accent' size='md'>Medium</StitchesButton>
                      <StitchesButton variant='accent' size='lg'>Large</StitchesButton>
                    </div>
                  </div>
                  <div>
                    <p className='text-xs font-medium text-muted-foreground mb-2'>Muted</p>
                    <div className='flex flex-wrap gap-3'>
                      <StitchesButton variant='muted' size='sm'>Small</StitchesButton>
                      <StitchesButton variant='muted' size='md'>Medium</StitchesButton>
                      <StitchesButton variant='muted' size='lg'>Large</StitchesButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Loading State</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Shows animated spinner and disables interaction
                </p>
                <div className='flex flex-wrap gap-4'>
                  <StitchesButton isLoading variant='primary'>Loading...</StitchesButton>
                  <StitchesButton isLoading variant='secondary'>Loading...</StitchesButton>
                  <StitchesButton isLoading variant='accent'>Loading...</StitchesButton>
                </div>
              </div>

              {/* Disabled State */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Disabled State</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Disabled buttons show reduced opacity and cursor-not-allowed
                </p>
                <div className='flex flex-wrap gap-4'>
                  <StitchesButton disabled variant='primary'>Disabled Primary</StitchesButton>
                  <StitchesButton disabled variant='secondary'>Disabled Secondary</StitchesButton>
                  <StitchesButton disabled variant='accent'>Disabled Accent</StitchesButton>
                  <StitchesButton disabled variant='muted'>Disabled Muted</StitchesButton>
                </div>
              </div>

              {/* Interactive Demo */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Interactive Demo</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Try hovering and clicking to see the spring animation and 3D press effect
                </p>
                <div className='flex gap-4'>
                  <AltButton />
                </div>
              </div>

              {/* Stitched Tabs */}
              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold'>Stitched Tabs</h3>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Tab component with stitched button aesthetic - thick border with perforated dotted line
                </p>

                {/* Basic Tabs */}
                <div className='space-y-6'>
                  <div>
                    <p className='text-xs font-medium text-muted-foreground mb-3'>Basic Tabs</p>
                    <StitchedTabs
                      defaultTab='overview'
                      tabs={[
                        { id: 'overview', label: 'Overview' },
                        { id: 'details', label: 'Details' },
                        { id: 'settings', label: 'Settings' },
                      ]}
                    />
                  </div>

                  {/* Tabs with Content */}
                  <div>
                    <p className='text-xs font-medium text-muted-foreground mb-3'>With Content & Transitions</p>
                    <StitchedTabs
                      defaultTab='features'
                      tabs={[
                        {
                          id: 'features',
                          label: 'Features',
                          content: (
                            <div className='rounded-lg bg-muted p-4'>
                              <ul className='text-sm space-y-2'>
                                <li>✨ Stitched aesthetic with thick primary border</li>
                                <li>🎨 Perforated dotted line overlay</li>
                                <li>🎬 Smooth spring animations</li>
                                <li>🌙 Full dark mode support</li>
                              </ul>
                            </div>
                          ),
                        },
                        {
                          id: 'usage',
                          label: 'Usage',
                          content: (
                            <div className='rounded-lg bg-muted p-4'>
                              <p className='text-sm font-mono text-xs bg-background/50 rounded p-2'>
                                &lt;StitchedTabs defaultTab='features' tabs={'{tabs}'} /&gt;
                              </p>
                            </div>
                          ),
                        },
                        {
                          id: 'advanced',
                          label: 'Advanced',
                          content: (
                            <div className='rounded-lg bg-muted p-4'>
                              <p className='text-sm'>The active tab fills with the primary color while text remains white. Inactive tabs use muted foreground text. All transitions use spring physics for natural movement.</p>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Chat Components Section */}
        {activeSection === 'chat-components' && (
          <div className='space-y-8'>
            {/* Mode Toggle */}
            <section className='space-y-4'>
              <div>
                <h2 className='text-xl font-bold'>Mode Toggle</h2>
                <p className='text-sm text-muted-foreground'>
                  Allows users to switch between chat modes
                </p>
              </div>

              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <h3 className='font-semibold mb-4'>Current Mode: {currentMode}</h3>
                <ModeToggle
                  modes={['reading-resource', 'teaching-assistant', 'magic-librarian']}
                  currentMode={currentMode}
                  onModeChange={setCurrentMode}
                  modeConfigs={modeConfigs}
                  accessLevel='free'
                />
              </div>
            </section>

            {/* Message List */}
            <section className='space-y-4'>
              <div>
                <h2 className='text-xl font-bold'>Message List</h2>
                <p className='text-sm text-muted-foreground'>
                  Displays conversation messages with auto-scroll support
                </p>
              </div>

              <div className='rounded-lg border border-border bg-card overflow-hidden'>
                <div className='bg-muted px-6 py-4 border-b border-border'>
                  <h3 className='font-semibold'>Sample Conversation</h3>
                </div>
                <div className='h-96 bg-background'>
                  <MessageList messages={messages} isLoading={isLoading} enableAutoScroll={true} />
                </div>
              </div>
            </section>

            {/* Chat Input */}
            <section className='space-y-4'>
              <div>
                <h2 className='text-xl font-bold'>Chat Input</h2>
                <p className='text-sm text-muted-foreground'>
                  Text input for sending messages to the AI assistant
                </p>
              </div>

              <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  placeholder='Type your message here...'
                />
              </div>
            </section>

            {/* Conversation Sidebar */}
            <section className='space-y-4'>
              <div>
                <h2 className='text-xl font-bold'>Conversation Sidebar</h2>
                <p className='text-sm text-muted-foreground'>
                  Navigation sidebar for viewing conversation history
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
                <div className='rounded-lg border border-border bg-card overflow-hidden h-80'>
                  <ConversationSidebar
                    conversations={SAMPLE_CONVERSATIONS}
                    currentConversationId={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    modeLabel='All Conversations'
                    isOpen={true}
                  />
                </div>

                <div className='lg:col-span-3'>
                  <div className='rounded-lg border border-border bg-card p-6 h-80'>
                    <h3 className='font-semibold mb-2'>
                      Selected: {SAMPLE_CONVERSATIONS.find((c) => c.id === selectedConversation)?.title}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      Selected conversation ID: {selectedConversation}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Chat Display (Full Integration) */}
            <section className='space-y-4'>
              <div>
                <h2 className='text-xl font-bold'>Chat Display (Full Integration)</h2>
                <p className='text-sm text-muted-foreground'>
                  Complete chat interface combining all components
                </p>
              </div>

              <div className='h-96 rounded-lg border border-border overflow-hidden bg-background'>
                <ChatDisplay
                  sidebar={
                    <ConversationSidebar
                      conversations={SAMPLE_CONVERSATIONS}
                      currentConversationId={selectedConversation}
                      onSelectConversation={setSelectedConversation}
                      modeLabel='Conversations'
                      isOpen={sidebarOpen}
                    />
                  }
                  modeToggle={
                    <ModeToggle
                      modes={['reading-resource', 'teaching-assistant', 'magic-librarian']}
                      currentMode={currentMode}
                      onModeChange={setCurrentMode}
                      modeConfigs={modeConfigs}
                      accessLevel='free'
                    />
                  }
                  messageList={<MessageList messages={messages} isLoading={isLoading} enableAutoScroll={true} />}
                  chatInput={<ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />}
                  showSidebar={sidebarOpen}
                  onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
