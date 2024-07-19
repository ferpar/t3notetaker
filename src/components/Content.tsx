"use client";
import { useEffect, useState } from "react";
import type { Topic } from "@prisma/client";
import type { Session } from "next-auth";
import { api } from "~/trpc/react";
import { NoteEditor } from "./NoteEditor";

type Props = {
  sessionData: Session | null;
};

export const Content = ({ sessionData }: Props) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
    },
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    { topicId: selectedTopic?.id ?? "" },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null
    }
  )

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    }
  })

  useEffect(() => {
    setSelectedTopic( selectedTopic => selectedTopic ?? topics?.[0] ?? null);
  }, [topics]);

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu w-56 rounded-box bg-base-100 p-2">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
                {topic.id === selectedTopic?.id ? "selected" : ""}
              </a>
            </li>
          ))}
        </ul>
        <div className="divider"></div>
        <input
          type="text"
          placeholder="New topic"
          className="input input-sm input-bordered w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({
                title: e.currentTarget.value,
              });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3">
        <NoteEditor 
          onSave={({title, content}) => {
            void createNote.mutate({
              title,
              content,
              topicId: selectedTopic?.id ?? ""
            })
          }}
        />
      </div>
    </div>
  );
};
