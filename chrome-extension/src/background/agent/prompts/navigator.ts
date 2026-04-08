/* eslint-disable @typescript-eslint/no-unused-vars */
import { BasePrompt } from './base';
import { type HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { AgentContext } from '@src/background/agent/types';
import { createLogger } from '@src/background/log';
import { navigatorSystemPromptTemplate } from './templates/navigator';
import type { UserProfile } from '@extension/storage/lib/profile/user';

const logger = createLogger('agent/prompts/navigator');

function buildProfileSection(profile: UserProfile): string {
  const lines: string[] = [];

  if (profile.firstName || profile.lastName) {
    lines.push(`Full Name: ${[profile.firstName, profile.lastName].filter(Boolean).join(' ')}`);
  }
  if (profile.email) lines.push(`Email: ${profile.email}`);
  if (profile.phone) lines.push(`Phone: ${profile.phone}`);
  if (profile.dateOfBirth) lines.push(`Date of Birth: ${profile.dateOfBirth}`);

  const addressParts = [profile.addressLine1, profile.addressLine2, profile.city, profile.state, profile.zipCode, profile.country].filter(Boolean);
  if (addressParts.length > 0) lines.push(`Address: ${addressParts.join(', ')}`);

  if (profile.jobTitle) lines.push(`Job Title: ${profile.jobTitle}`);
  if (profile.company) lines.push(`Company: ${profile.company}`);
  if (profile.yearsOfExperience) lines.push(`Years of Experience: ${profile.yearsOfExperience}`);
  if (profile.skills) lines.push(`Skills: ${profile.skills}`);
  if (profile.linkedIn) lines.push(`LinkedIn: ${profile.linkedIn}`);
  if (profile.website) lines.push(`Website/Portfolio: ${profile.website}`);

  if (profile.highestDegree) lines.push(`Highest Degree: ${profile.highestDegree}`);
  if (profile.fieldOfStudy) lines.push(`Field of Study: ${profile.fieldOfStudy}`);
  if (profile.university) lines.push(`University: ${profile.university}`);
  if (profile.graduationYear) lines.push(`Graduation Year: ${profile.graduationYear}`);

  if (lines.length === 0) return '';

  return `
13. User Profile for Form Filling:

The user has saved their personal information for auto-filling forms. Use these details whenever a form asks for personal information:

${lines.map(l => `- ${l}`).join('\n')}

IMPORTANT: This information is stored locally and is confidential. Use it to fill forms accurately when the user asks you to fill forms or apply for jobs. Never log or expose this information in plain text responses unless directly confirming what was filled.
`;
}

export class NavigatorPrompt extends BasePrompt {
  private systemMessage: SystemMessage;

  constructor(private readonly maxActionsPerStep = 10, userProfile?: UserProfile) {
    super();

    const promptTemplate = navigatorSystemPromptTemplate;
    let formattedPrompt = promptTemplate.replace('{{max_actions}}', this.maxActionsPerStep.toString()).trim();

    if (userProfile) {
      const profileSection = buildProfileSection(userProfile);
      if (profileSection) {
        // Insert profile section just before closing </system_instructions>
        formattedPrompt = formattedPrompt.replace('</system_instructions>', `${profileSection}\n</system_instructions>`);
      }
    }

    this.systemMessage = new SystemMessage(formattedPrompt);
  }

  getSystemMessage(): SystemMessage {
    /**
     * Get the system prompt for the agent.
     *
     * @returns SystemMessage containing the formatted system prompt
     */
    return this.systemMessage;
  }

  async getUserMessage(context: AgentContext): Promise<HumanMessage> {
    return await this.buildBrowserStateUserMessage(context);
  }
}
