import type { WebsiteId } from "@/types/website";

export const getWebsiteDisplayName = (websiteId: WebsiteId) => {
  switch (websiteId) {
    case 'rvtrader': return "RV Trader";
    case 'cycletrader': return "Cycle Trader";
    case 'carsales': return "Carsales";
    default: throw new Error('Unknown websiteId');
  }
}