"use client";
import React, {useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { addBudjet, getBudgetsByUser } from "../actions";
import Notification from "../components/Notification";
import { Budget } from "@/type";
import Link from "next/link";
import BudgetItem from "../components/BudgetItem";
import { Landmark } from "lucide-react";

const Page = () => {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  const handleAddBudget = async () => {
    try {
      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Le montant doit être un nombre positive");
      }
      await addBudjet(
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amount,
        selectedEmoji
      )
      fetchBudgets();

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
      setNotification("Nouveau budget ajouté avec succès")
      setBudgetName("")
      setBudgetAmount("")
      setSelectedEmoji("")
      setShowEmojiPicker(false)
    } catch (error) {
      setNotification(`Erreur: ${error}`);
    }
  };

  const fetchBudgets = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const userBudgets = await getBudgetsByUser(user?.primaryEmailAddress?.emailAddress)
        setBudgets(userBudgets)
      } catch (error) {
        setNotification(`Erreur lors de la récupération des budgets: ${error}`);
      }
    }
  }

  useEffect(() => {
    fetchBudgets();
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onclose={closeNotification}
        ></Notification>
      )}
      <button
        className="btn mb-4"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        Nouveau budget
        <Landmark className="w-4"/>
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Création d&apos;un budjets</h3>
          <p className="py-4">permet de contrôler ces depenses facilement </p>
          <div className="w-full flex flex-col">
            <input
              type="text"
              value={budgetName}
              placeholder="Nom du budget"
              onChange={(e) => setBudgetName(e.target.value)}
              className="input input-bordered mb-3"
              required
            />
            <input
              type="Number"
              value={budgetAmount}
              placeholder="Montant du budget"
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="input input-bordered mb-3"
              required
            />
            <button
              className="btn mb-3"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectedEmoji || "Choisir un emoji 🫵"}
            </button>
            {showEmojiPicker && (
              <div className="flex justify-center items-center my-4">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}

            <button onClick={handleAddBudget} className="btn ">
              Ajouter Budjet
            </button>
          </div>
        </div>
      </dialog>

      <ul className="grid md:grid-cols-3 gap-4">
        {budgets.map((budget) => (
            <Link key={budget.id} href={`/manage/${budget.id}`}>
            <BudgetItem budget={budget} enablehoder={1} />
            </Link>
        ))}
      </ul>
    </Wrapper>
  );
};

export default Page;
