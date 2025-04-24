
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const ReviewStats = () => {
  // Mock data - in a real app this would come from an API
  const stats = {
    totalReviews: 15,
    averageRating: 4.5,
    ratingDistribution: [
      { stars: 5, count: 8 },
      { stars: 4, count: 5 },
      { stars: 3, count: 2 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ],
  };

  const maxCount = Math.max(...stats.ratingDistribution.map(r => r.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-playfair text-iazi-text">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2 font-inter text-iazi-text">{stats.averageRating}</div>
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < Math.floor(stats.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : index < stats.averageRating
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-inter">
            {stats.totalReviews} avaliações
          </p>
        </div>

        <div className="space-y-2">
          {stats.ratingDistribution.reverse().map((rating) => (
            <div key={rating.stars} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-16">
                <span className="font-medium font-inter">{rating.stars}</span>
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${(rating.count / maxCount) * 100}%`,
                  }}
                />
              </div>
              <div className="w-8 text-sm text-muted-foreground font-inter">
                {rating.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewStats;
