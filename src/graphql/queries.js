import { gql } from '@apollo/client';

// User queries - Updated to match deployed AppSync schema
export const GET_ME = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      firstName
      lastName
      profileImage
      linkedinUrl
      userType
      createdAt
      updatedAt
    }
  }
`;

// Note: getUsers query is not available in the deployed schema
// If you need to list users, you'll need to:
// 1. Add the query to your serverless.yml schema
// 2. Create a resolver for it
// 3. Then uncomment and use this query:
/*
export const GET_USERS = gql`
  query GetUsers($userType: UserType) {
    getUsers(userType: $userType) {
      id
      email
      firstName
      lastName
      userType
      createdAt
      updatedAt
    }
  }
`;
*/

// Military Member queries
export const GET_MILITARY_MEMBERS = gql`
  query ListMilitaryMembers($limit: Int, $nextToken: String) {
    listMilitaryMembers(limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        user {
          id
          email
          firstName
          lastName
        }
        militaryBranch
        rank
        militaryBase
        region
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_MILITARY_MEMBER = gql`
  query GetMilitaryMember($id: ID!) {
    getMilitaryMember(id: $id) {
      id
      userId
      user {
        id
        email
        firstName
        lastName
      }
      militaryBranch
      rank
      militaryBase
      region
      createdAt
      updatedAt
    }
  }
`;

// Champion queries
export const GET_CHAMPIONS = gql`
  query ListChampions($limit: Int, $nextToken: String) {
    listChampions(limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        user {
          id
          email
          firstName
          lastName
        }
        region
        expertise
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_CHAMPION = gql`
  query GetChampion($id: ID!) {
    getChampion(id: $id) {
      id
      userId
      user {
        id
        email
        firstName
        lastName
      }
      region
      expertise
      certifications
      availableHours
      menteeCapacity
      rating
      bio
      linkedInProfile
      yearsExperience
      industries
      createdAt
      updatedAt
    }
  }
`;

// Progress queries
export const GET_PROGRESS = gql`
  query GetProgress($memberId: ID!) {
    getProgress(memberId: $memberId) {
      id
      memberId
      currentPhase
      completionPercentage
      practiceTestScores
      lastActivity
      member {
        id
        firstName
        lastName
        rank
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROGRESS_HISTORY = gql`
  query GetProgressHistory($memberId: ID!) {
    getProgressHistory(memberId: $memberId) {
      id
      memberId
      currentPhase
      completionPercentage
      practiceTestScores
      lastActivity
      createdAt
      updatedAt
    }
  }
`;

// Assignment queries
export const GET_ASSIGNMENTS = gql`
  query GetAssignments($status: AssignmentStatus, $championId: ID, $memberId: ID) {
    getAssignments(status: $status, championId: $championId, memberId: $memberId) {
      id
      memberId
      championId
      status
      assignedAt
      member {
        id
        firstName
        lastName
        rank
        militaryBase
      }
      champion {
        id
        firstName
        lastName
        region
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ASSIGNMENT = gql`
  query GetAssignment($id: ID!) {
    getAssignment(id: $id) {
      id
      memberId
      championId
      status
      assignedAt
      member {
        id
        firstName
        lastName
        rank
        militaryBase
        email
      }
      champion {
        id
        firstName
        lastName
        region
        email
      }
      createdAt
      updatedAt
    }
  }
`;

// Message and conversation queries
export const GET_CONVERSATIONS = gql`
  query GetConversations {
    getConversations {
      id
      participants
      lastMessage {
        id
        content
        fromUserId
        createdAt
      }
      unreadCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONVERSATION = gql`
  query GetConversation($participants: [ID!]!) {
    getConversation(participants: $participants) {
      id
      participants
      createdAt
      updatedAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!, $limit: Int, $nextToken: String) {
    getMessages(conversationId: $conversationId, limit: $limit, nextToken: $nextToken) {
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

// Activity queries
export const GET_ACTIVITIES = gql`
  query GetActivities($limit: Int, $nextToken: String) {
    getActivities(limit: $limit, nextToken: $nextToken) {
      id
      userId
      type
      description
      metadata
      createdAt
    }
  }
`;

// Reference data queries
export const GET_MILITARY_BASES = gql`
  query GetMilitaryBases {
    getMilitaryBases {
      items {
        id
        name
        fullName
        description
        label
        value
        state
        branch
        baseType
        region
        type
        active
        champion
        championEmail
        sortOrder
      }
      nextToken
    }
  }
`;

export const GET_CHAMPION_REGIONS = gql`          
  query GetChampionRegions {
    getChampionRegions {
      id
      type
      value
      label
      description
      metadata
      active
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

// Security / access queries
export const GET_CHAMPION_ACCESS_CODE = gql`
  query GetChampionAccessCode($accessCode: String!) {
    getChampionAccessCode(accessCode: $accessCode) {
      id
      type
      value
      label
      description
      metadata
      active
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

// Admin queries
export const GET_SYSTEM_STATS = gql`
  query GetSystemStats {
    getSystemStats {
      totalMembers
      totalChampions
      totalAssignments
      averageCertificationRate
      regionalStats {
        region
        memberCount
        championCount
        certificationRate
      }
      recentActivity {
        date
        newMembers
        newChampions
        completedCertifications
      }
    }
  }
`;
