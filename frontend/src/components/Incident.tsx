// src/components/Incident.tsx
import type { Timestamp } from "firebase/firestore";
import React from "react";
type Props = {
  description?: string;
  date?: Timestamp;
};
export default function Incident({ description, date }: Props) {
  return (
    <>
      <li className="flex flex-col">
        <div className="flex flex-col justify-between gap-8 border min-h-30 bg-white m-2 p-3 rounded-md shadow-sm hover:shadow-lg">
          <p>{description}</p>
          <div className="bg-gray-200 text-gray-700 rounded-md p-2 w-fit">
            <p>{date?.toDate().toLocaleDateString()}</p>
          </div>
        </div>
      </li>
    </>
  );
}
