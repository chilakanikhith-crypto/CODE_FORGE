export default function MovingStudents() {

  const students = [
    { top: "20%", left: "50%", delay: "0s" },
    { top: "50%", left: "30%", delay: "1s" },
    { top: "50%", left: "70%", delay: "2s" },
    { top: "80%", left: "50%", delay: "3s" },
    { top: "35%", left: "50%", delay: "1.5s" },
    { top: "60%", left: "50%", delay: "2.5s" },
  ];

  return (
    <>
      {students.map((student, index) => (
        <div
          key={index}
          style={{
            top: student.top,
            left: student.left,
            animationDelay: student.delay,
          }}
          className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-bounce"
        />
      ))}
    </>
  );
}