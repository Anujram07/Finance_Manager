import React, { useEffect, useState } from "react";
import {
  Target,
  Trash2,
  PlusCircle
} from "lucide-react";

const Goal = ({ className = "" }) => {

  const [goals, setGoals] = useState([]);

  const [form, setForm] = useState({
    goalName: "",
    goalType: "Emergency Fund",
    customGoalType: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
    image: ""
  });

  const goalTypes = [
    "Emergency Fund",
    "Vehicle",
    "House",
    "Education",
    "Vacation",
    "Retirement",
    "Business",
    "Investment",
    "Wedding",
    "Custom"
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {

    try {

      const token =
        localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:5000/api/goals",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setGoals(data.goals);
      }

    } catch (error) {
      console.error(error);
    }

  };

  const createGoal = async () => {

    try {

      const token =
        localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:5000/api/goals",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (data.success) {

        setForm({
          goalName: "",
          goalType: "Emergency Fund",
          customGoalType: "",
          targetAmount: "",
          savedAmount: "",
          deadline: "",
          image: ""
        });

        fetchGoals();
      }

    } catch (error) {
      console.error(error);
    }

  };

  const deleteGoal = async (id) => {

    try {

      const token =
        localStorage.getItem("authToken");

      await fetch(
        `http://localhost:5000/api/goals/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchGoals();

    } catch (error) {
      console.error(error);
    }

  };

  return (
    <div
      className={`bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 ${className}`}
    >

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
          <Target size={24} />
        </div>

        <div>
          <h3 className="text-xl font-black tracking-tight">
            Financial Goals
          </h3>

          <p className="text-xs text-slate-400 font-medium">
            Create and track your financial goals.
          </p>
        </div>
      </div>

      {/* Create Goal Form */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <input
          type="text"
          placeholder="Goal Name"
          value={form.goalName}
          onChange={(e) =>
            setForm({
              ...form,
              goalName: e.target.value
            })
          }
          className="p-3 rounded-xl border"
        />

        <select
          value={form.goalType}
          onChange={(e) =>
            setForm({
              ...form,
              goalType: e.target.value
            })
          }
          className="p-3 rounded-xl border"
        >
          {goalTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {form.goalType === "Custom" && (
          <input
            type="text"
            placeholder="Custom Goal Type"
            value={form.customGoalType}
            onChange={(e) =>
              setForm({
                ...form,
                customGoalType: e.target.value
              })
            }
            className="p-3 rounded-xl border md:col-span-2"
          />
        )}

        <input
          type="number"
          placeholder="Target Amount"
          value={form.targetAmount}
          onChange={(e) =>
            setForm({
              ...form,
              targetAmount: e.target.value
            })
          }
          className="p-3 rounded-xl border"
        />

        <input
          type="number"
          placeholder="Already Saved"
          value={form.savedAmount}
          onChange={(e) =>
            setForm({
              ...form,
              savedAmount: e.target.value
            })
          }
          className="p-3 rounded-xl border"
        />

        <input
          type="date"
          value={form.deadline}
          onChange={(e) =>
            setForm({
              ...form,
              deadline: e.target.value
            })
          }
          className="p-3 rounded-xl border"
        />

        <button
          onClick={createGoal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-3 font-bold flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Create Goal
        </button>
      </div>

      {/* Goal List */}
      <div className="space-y-4">

        {goals.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            No goals created yet.
          </div>
        )}

        {goals.map(goal => {

          const progress =
            goal.targetAmount > 0
              ? Math.min(
                (goal.savedAmount / goal.targetAmount) * 100,
                100
              )
              : 0;

          return (
            <div
              key={goal._id}
              className="border rounded-2xl p-5 bg-slate-50"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h4 className="font-bold text-lg">
                    {goal.goalName}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {goal.goalType}
                  </p>
                </div>

                <button
                  onClick={() => deleteGoal(goal._id)}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <div className="mt-4">

                <div className="flex justify-between text-sm mb-1">
                  <span>
                    ₹{goal.savedAmount?.toLocaleString("en-IN")}
                  </span>

                  <span>
                    ₹{goal.targetAmount?.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{
                      width: `${progress}%`
                    }}
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {progress.toFixed(1)}% Completed
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Deadline: {goal.deadline?.slice(0, 10)}
                </p>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Goal;
