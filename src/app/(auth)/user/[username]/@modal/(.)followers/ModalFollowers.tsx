"use client";

import UserWithFollowButtonCard from "@/components/UserWithFollowButtonCard";
import useBoundProfileStore from "@/lib/zustand/stores/profilePage";
import { useRouter } from "next/navigation";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ModalFollowers() {
    const { followers } = useBoundProfileStore();
    const router = useRouter();
    const closeModal = () => {
        router.back();
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div
                onClick={closeModal}
                className="absolute inset-0 bg-background/50 backdrop-blur"
            ></div>
            <div className="relative h-max max-h-[500px] w-full max-w-sm rounded-lg border border-skin bg-background">
                <div className="relative space-x-2 border-b border-skin py-3 text-center">
                    <h1 className="font-semibold tracking-wide">Followers</h1>
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button onClick={closeModal}>
                            <XMarkIcon className="aspect-square w-5" />
                        </button>
                    </div>
                </div>
                {followers.map((user) => (
                    <UserWithFollowButtonCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}
