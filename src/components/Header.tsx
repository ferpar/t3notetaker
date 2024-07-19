"use client"
import { signOut, signIn } from "next-auth/react";
import type { Session } from "next-auth";

type HeaderProps = {
  sessionData: Session | null;
};

export const Header = ({ sessionData }: HeaderProps) => {

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ""}
        test
      </div>
      <div className="dropdown dropdown-end">
        { sessionData?.user ?(
        <label
          tabIndex={0}
          className="btn-ghost btn-circle avatar btn"
          onClick={() => void signOut()}
        >
          <div className="w-10 rounded-full">
            <img
              src={sessionData?.user?.image ?? ""}
              alt={sessionData?.user?.name ?? ""}
            />
          </div>
        </label>

        ) : (
          <button
            className="btn-ghost rounded-btn btn"
            onClick={() => void signIn()}
            >
              Sign in
            </button>
        )
        }
      </div>
    </div>
  );
};
