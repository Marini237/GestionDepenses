"use client";
import {
  addTransactionsToBudget,
  deleteBudget,
  deleteTransaction,
  getTransactionsByBudgetId,
} from "@/app/actions";
import BudgetItem from "@/app/components/BudgetItem";
import Wrapper from "@/app/components/Wrapper";
import { Budget } from "@/type";
import React, { useEffect, useState } from "react";
import Notification from "@/app/components/Notification";
import { Send, Trash } from "lucide-react";
import { redirect } from "next/navigation";

const Page = ({ params }: { params: Promise<{ budgetId: string }> }) => {
  const [budgetId, setBudgetId] = useState<string>("");
  const [budget, setBudget] = useState<Budget>();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };
  async function fetchBudgetData(budjetId: string) {
    try {
      const budgetData = await getTransactionsByBudgetId(budjetId);
      setBudget(budgetData);
    } catch (error) {
      console.error("Erreur lors de la récupération du budget:", error);
    }
  }
  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId);
      fetchBudgetData(resolvedParams.budgetId);
    };
    getId();
  }, [params]);
  const handleAddTransaction = async () => {
    if (!amount || !description) {
      setNotification("Veuillez remplir tous les champs");
      return;
    }
    try {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("Le montant doit être un nombre positif");
      }
      const newTransaction = await addTransactionsToBudget(
        budgetId,
        amountNumber,
        description
      );

      setNotification("Dépense ajoutée avec succès");
      fetchBudgetData(budgetId);

      setAmount("");
      setDescription("");
    } catch (error) {
      setNotification(`vous avez dépassé votre budget `);
    }
  };

  const handleDeleteBudget = async () => {
	const confirmed = window.confirm("Voulez-vous vraiment supprimer ce budget et tout ces transactions associées ?")
	if (confirmed) {
	  try {
		await deleteBudget(budgetId);
		setNotification("Budget supprimé avec succès");
		setBudget(undefined);
	  } catch (error) {
		console.error("Erreur lors de la suppression du budget :", error);
	  }
    redirect("/budjets");
	}
  }
  const handleDeleteTransaction = async (transactionId: string) => { 
	const confirmed = window.confirm("Voulez-vous vraiment supprimer cette transaction ?")
	if (confirmed) {
	  try {
		await deleteTransaction(transactionId);
		fetchBudgetData(budgetId);
		setNotification("Transaction supprimée avec succès");
		setNotification("Transaction supprimée avec succès");
	  }
	  catch (error) {
		console.error("Erreur lors de la suppression de la transaction :", error);
	  }
  }
}
  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onclose={closeNotification}
        ></Notification>
      )}
      {budget && (
        <div className="flex md:flex-row flex-col">
          <div className="md:w-1/3">
            <BudgetItem budget={budget} enablehoder={0} />
            <button 
			onClick={() => handleDeleteBudget()}
			className="btn mt-4">supprimer le budget</button>
            <div className="space-y-4 flex flex-col mt-4">
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="input input-bordered"
              />
              <input
                type="number"
                id="amount"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className=" input input-bordered"
              />
              <button onClick={handleAddTransaction} className="btn">
                Ajouter votre dépense
              </button>
            </div>
          </div>
          {budget.transactions && budget.transactions.length > 0 ? (
            <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Montant</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {budget?.transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="text-lg md:text-3xl">{transaction.emoji}</td>
                      <td><div className="badge badge-accent badge-xs md:badge-sm">-{transaction.amount} €</div></td>
                      <td>{transaction.description}</td>
					  <td>{transaction.createdAt.toLocaleDateString("fr-FR")}</td>
					  <td>{transaction.createdAt.toLocaleTimeString("fr-FR" , {
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
					  })}</td>
					  <td>
						<button
						onClick={() => handleDeleteTransaction(transaction.id) } className="btn btn-sm"><Trash className="w-4"/></button>
					  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="md:w-2/3 mt-10 md:ml-4 flex items-center justify-center">
              <Send strokeWidth={1.5} className="w-8 h-8 text-accent " />
              <span className="text-gray-500 ml-2"> aucune transaction</span>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default Page;
