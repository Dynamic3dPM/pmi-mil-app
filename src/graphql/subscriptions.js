import { gql } from '@apollo/client';

// Message subscriptions
export const MESSAGE_RECEIVED = gql`
  subscription MessageReceived($userId: ID!) {
    messageReceived(userId: $userId) {
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

// Progress subscriptions
export const PROGRESS_UPDATED = gql`
  subscription ProgressUpdated($memberId: ID!) {
    progressUpdated(memberId: $memberId) {
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

// Assignment subscriptions
export const MEMBER_ASSIGNED = gql`
  subscription MemberAssigned($championId: ID!) {
    memberAssigned(championId: $championId) {
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

export const ASSIGNMENT_UPDATED = gql`
  subscription AssignmentUpdated($userId: ID!) {
    assignmentUpdated(userId: $userId) {
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

// Conversation subscriptions
export const CONVERSATION_UPDATED = gql`
  subscription ConversationUpdated($userId: ID!) {
    conversationUpdated(userId: $userId) {
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

// Activity subscriptions
export const ACTIVITY_LOGGED = gql`
  subscription ActivityLogged($userId: ID!) {
    activityLogged(userId: $userId) {
      id
      userId
      type
      description
      metadata
      createdAt
    }
  }
`;

// System subscriptions (Admin only)
export const SYSTEM_STATS_UPDATED = gql`
  subscription SystemStatsUpdated {
    systemStatsUpdated {
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
