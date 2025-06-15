import { gql } from '@apollo/client';

// Auth mutations - Fixed to match your schema exactly
export const CHAMPION_SIGNUP = gql`
  mutation ChampionSignup($input: ChampionSignupInput!) {
    championSignup(input: $input) {
      success
      message
      user {
        id
        email
        firstName
        lastName
        userType
      }
      champion {
        id
        userId
        region
        expertise
        certifications
        availableHours
        menteeCapacity
        bio
        linkedInProfile
        yearsExperience
        industries
      }
      temporaryPassword
    }
  }
`;

export const ACTIVE_DUTY_SIGNUP = gql`
  mutation ActiveDutySignup($input: MilitaryMemberSignupInput!) {
    activeDutySignup(input: $input) {
      success
      message
      user {
        id
        email
        firstName
        lastName
        userType
        phoneNumber
        region
        assignedChampion
        assignedChampionEmail
        assignedDate
      }
      champion {
        id
        userId
        region
        expertise
        certifications
        availableHours
        menteeCapacity
        bio
        linkedInProfile
        yearsExperience
        industries
      }
      temporaryPassword
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      user {
        id
        email
        firstName
        lastName
        userType
      }
      accessToken
      refreshToken
    }
  }
`;

// For backward compatibility with existing code
export const SIGNUP = CHAMPION_SIGNUP;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      firstName
      lastName
      profileImage
      linkedinUrl
      phoneNumber
      region
      updatedAt
    }
  }
`;

export const ASSIGN_USER_TO_CHAMPION = gql`
  mutation AssignUserToChampion($input: AssignUserToChampionInput!) {
    assignUserToChampion(input: $input) {
      id
      email
      firstName
      lastName
      userType
      region
      assignedChampion
      assignedChampionEmail
      assignedDate
      updatedAt
    }
  }
`;

// Additional mutations from your original file that might be used elsewhere
export const CREATE_MILITARY_MEMBER = gql`
  mutation CreateMilitaryMember($input: CreateMilitaryMemberInput!) {
    createMilitaryMember(input: $input) {
      id
      email
      firstName
      lastName
      rank
      militaryBase
      region
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MILITARY_MEMBER = gql`
  mutation UpdateMilitaryMember($id: ID!, $input: UpdateMilitaryMemberInput!) {
    updateMilitaryMember(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      rank
      militaryBase
      region
      updatedAt
    }
  }
`;

export const DELETE_MILITARY_MEMBER = gql`
  mutation DeleteMilitaryMember($id: ID!) {
    deleteMilitaryMember(id: $id) {
      id
      email
      firstName
      lastName
    }
  }
`;

export const CREATE_CHAMPION = gql`
  mutation CreateChampion($input: CreateChampionInput!) {
    createChampion(input: $input) {
      id
      email
      firstName
      lastName
      region
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CHAMPION = gql`
  mutation UpdateChampion($id: ID!, $input: UpdateChampionInput!) {
    updateChampion(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      region
      updatedAt
    }
  }
`;

export const DELETE_CHAMPION = gql`
  mutation DeleteChampion($id: ID!) {
    deleteChampion(id: $id) {
      id
      email
      firstName
      lastName
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      conversationId
      content
      fromUserId
      toUserId
      from {
        id
        firstName
        lastName
        userType
      }
      to {
        id
        firstName
        lastName
        userType
      }
      createdAt
      updatedAt
    }
  }
`;

export const LOG_ACTIVITY = gql`
  mutation LogActivity($input: LogActivityInput!) {
    logActivity(input: $input) {
      id
      userId
      type
      description
      metadata
      createdAt
    }
  }
`;