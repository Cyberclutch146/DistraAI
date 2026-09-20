export interface CommunityMessage {
  id: string;
  username: string;
  initials: string;
  avatarColor: string;
  message: string;
  timestamp: Date;
  location: string;
  type: "report" | "update" | "question";
}

const now = new Date();
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000);

export const mockCommunityMessages: CommunityMessage[] = [
  {
    id: "MSG-001",
    username: "Arun K.",
    initials: "AK",
    avatarColor: "hsl(210 70% 50%)",
    message:
      "Water level rising fast near Aluva bridge. Road is partially submerged. Cars turning back.",
    timestamp: minsAgo(8),
    location: "Aluva, Ernakulam",
    type: "report",
  },
  {
    id: "MSG-002",
    username: "Priya M.",
    initials: "PM",
    avatarColor: "hsl(280 60% 50%)",
    message:
      "Small landslip on Lakkidi Ghat road. No one injured but debris blocking one lane. Proceed with caution.",
    timestamp: minsAgo(22),
    location: "Lakkidi, Wayanad",
    type: "report",
  },
  {
    id: "MSG-003",
    username: "Rahul S.",
    initials: "RS",
    avatarColor: "hsl(150 60% 40%)",
    message:
      "Relief camp set up at Government School, Chalakudy. Food and water available. Need more volunteers.",
    timestamp: minsAgo(45),
    location: "Chalakudy, Thrissur",
    type: "update",
  },
  {
    id: "MSG-004",
    username: "Meera J.",
    initials: "MJ",
    avatarColor: "hsl(30 70% 50%)",
    message:
      "Is the Periyar bridge still passable? We need to get to the hospital in Angamaly.",
    timestamp: minsAgo(58),
    location: "Kalady, Ernakulam",
    type: "question",
  },
];
