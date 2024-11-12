"use client";

import { useUser } from "@clerk/nextjs";
import React, { use, useEffect, useState } from "react";
import {
  getLastBudgets,
  getLastTransactions,
  getReachedBudgets,
  getTotalTransactionAmount,
  getTotalTransactionCount,
  getUserBudgetData,
} from "../actions";
import { wrap } from "module";
import Wrapper from "../components/Wrapper";
import { CircleDollarSign, Landmark, PiggyBank } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Budget, Transaction } from "@/type";
import Link from "next/link";
import BudgetItem from "../components/BudgetItem";
import TransactionItem from "../components/TransactionItem";

const Page = () => {
  const { user } = useUser();
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [reachedBudgetRatio, setReachedBudgetRatio] = useState<number | null>(
    null
  );
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress as string;
      if (email) {
        const amount = await getTotalTransactionAmount(email);
        const count = await getTotalTransactionCount(email);
        const reachedBudget = await getReachedBudgets(email);
        const budgetData = await getUserBudgetData(email);
        const lastTransactions = await getLastTransactions(email);
        const lastBudgets = await getLastBudgets(email);
        setReachedBudgetRatio(reachedBudget);
        if (count !== undefined) {
          setTotalCount(count);
        }
        if (amount !== undefined) {
          setTotalAmount(amount);
        }
        if (budgetData) {
          setBudgetData(budgetData);
        }
        if (lastTransactions) {
          setTransactions(lastTransactions);
        }
        setBudgets(lastBudgets);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);
  return (
    <Wrapper>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <div>
          <div className="grid md:grid-cols-3 grid-4">
            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Total des transactions
                </span>
                <span className="text-2xl font-bold text-accent">
                  {totalAmount !== null ? `${totalAmount}€` : "N/A"}
                </span>
              </div>
              <CircleDollarSign className="bg-accent w-9 h-9 rounded-full p-1 text-white" />
            </div>
            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Nombre de transactions
                </span>
                <span className="text-2xl font-bold text-accent">
                  {totalCount !== null ? `${totalCount}` : "N/A"}
                </span>
              </div>
              <PiggyBank className="bg-accent w-9 h-9 rounded-full p-1 text-white" />
            </div>
            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Budget atteints</span>
                <span className="text-2xl font-bold text-accent">
                  {reachedBudgetRatio || "N/A"}
                </span>
              </div>
              <Landmark className="bg-accent w-9 h-9 rounded-full p-1 text-white" />
            </div>
          </div>
          <div className="w-full md:flex mt-4">
            <div className="rounded-xl md:w-2/3">
              <div className="border-2 border-base-300 p-5 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">
                  {" "}
                  Stactistique en €
                </h3>
                <ResponsiveContainer height={250} width="100%">
                  <BarChart width={730} height={250} data={budgetData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="budgetName" />
                    <Tooltip />
                    <Bar
                      name="Budget"
                      dataKey="totalBudgetAmount"
                      fill="#EF9FBC"
                      radius={[10, 10, 0, 0]}
                    />
                    <Bar
                      name="Dépensé"
                      dataKey="totalTransactionsAmount"
                      fill="#EEAF3A"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 border-2 border-base-300 p-5 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">
                  {" "}
                  Derniers Transactions
                </h3>
                <ul className="divide-y devide-base-300">
                  {transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:w-1/3 ml-4">
              <h3 className="text-lg font-semibold my-4 md:mb-4 md:mt-0">
                {" "}
                Derniers budgets
              </h3>
              <ul className="grid md:grid-cols-1 gap-4">
                {budgets.map((budget) => (
                  <Link key={budget.id} href={`/manage/${budget.id}`}>
                    <BudgetItem budget={budget} enablehoder={1} />
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default Page;
