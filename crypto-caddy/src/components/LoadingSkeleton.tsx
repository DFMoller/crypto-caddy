import { Box, Skeleton, Card, CardContent } from '@mui/material';

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 2 }: LoadingSkeletonProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ padding: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Coin icon skeleton */}
            <Skeleton variant="circular" width={40} height={40} />

            {/* Coin name/symbol skeleton */}
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="30%" height={24} />
              <Skeleton variant="text" width="20%" height={20} />
            </Box>

            {/* Market cap skeleton */}
            <Box sx={{ minWidth: 150, textAlign: 'right' }}>
              <Skeleton variant="text" width="100%" height={24} />
            </Box>

            {/* Price skeleton */}
            <Box sx={{ minWidth: 100, textAlign: 'right' }}>
              <Skeleton variant="text" width="100%" height={24} />
            </Box>

            {/* Sparkline skeleton */}
            <Skeleton variant="rectangular" width={120} height={40} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
