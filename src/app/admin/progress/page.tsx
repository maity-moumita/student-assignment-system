
import DashboardLayout from "@/components/common/DashboardLayout";
import ComingSoon from "@/components/common/ComingSoon";

export default function StudentProgressPage() {
  return (
    <DashboardLayout
      role="student"
      title="My Progress"
    >
      <ComingSoon
        title="My Learning Progress"
        description="Track your completed assignments, pending work and overall submission performance."
        backLink="/student"
      />
    </DashboardLayout>
  );
}
