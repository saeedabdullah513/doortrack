import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AttendanceEditForm } from "@/components/admin/attendance-edit-form";
import { formatDate } from "@/lib/utils";

export default async function AttendanceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const day = await prisma.attendanceDay.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      punchEntries: { orderBy: { sequence: "asc" } },
    },
  });
  if (!day) notFound();

  const entries = day.punchEntries.map((e) => ({
    id:              e.id,
    sequence:        e.sequence,
    punchInTime:     e.punchInTime.toISOString(),
    punchOutTime:    e.punchOutTime?.toISOString() ?? null,
    entryHours:      e.entryHours ? Number(e.entryHours) : null,
    punchInLat:      Number(e.punchInLat),
    punchInLng:      Number(e.punchInLng),
    punchInAddress:  e.punchInAddress,
    punchOutLat:     e.punchOutLat ? Number(e.punchOutLat) : null,
    punchOutLng:     e.punchOutLng ? Number(e.punchOutLng) : null,
    punchOutAddress: e.punchOutAddress,
  }));

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Edit Attendance</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {day.user.name} · {formatDate(day.date)}
        </p>
      </div>
      <AttendanceEditForm
        dayId={id}
        entries={entries}
        notes={day.notes ?? ""}
        editedByAdmin={day.editedByAdmin}
      />
    </div>
  );
}
