"use client";

import { useEffect, useState } from "react";
import { Button, message, notification, Select, Upload } from "antd";
import { Todo } from "@/types/todo.type";
import { useCreateTodo } from "@/hooks/useCreateTodo";
import { useTodos } from "@/hooks/useTodos";
import { useUpdateTodo } from "@/hooks/useUpdateTodo";
import { UploadOutlined, UserAddOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function HomePage() {
  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <div className="flex justify-center items-center min-h-screen bg-[#764ba2]">
        <div className="w-full max-w-6xl p-4 mt-2 space-y-6">
          <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
            <h2 className="w-full text-center pb-2 text-xl font-semibold text-gray-500 border-gray-400">
              Todo API - Real-time Client
            </h2>
            <h2 className="w-full text-center pb-2 text-xl font-semibold text-gray-500 border-b border-gray-400">
              Connected to WebSocket
            </h2>
            <div className="flex flex-row gap-6 pt-1 ">
              {/* Left */}
              <div className="flex-col w-full px-8 gap-y-6 border-gray-200 rounded-lg sm:flex-row">
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md  border-l-4 border-blue-500">
                    <h2 className="text-lg !font-bold text-center !text-gray-700 mb-4">
                      Create New Todo
                    </h2>

                    {/* Title */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="mb-1 text-sm text-gray-500">
                        Title *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter todo title"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="mb-1 text-sm text-gray-500">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Enter description (optional)"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400 resize-none"
                      />
                    </div>

                    {/* Priority */}
                    <div className="flex flex-col items-start mb-6">
                      <label className="mb-1 text-sm text-gray-500">
                        Priority
                      </label>
                      <Select className="w-full">
                        <Option value="Low">Low</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="High">High</Option>
                      </Select>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all cursor-poiter">
                      CREATE TODO
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md  border-l-4 border-blue-500">
                    <h2 className="text-lg !font-bold text-center !text-gray-700 mb-4">
                      Quick Actions
                    </h2>

                    {/* Title */}
                    <div className="flex flex-col items-start mb-4">
                      <label className="mb-1 text-sm text-gray-500">
                        Todo ID *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter todo id for actions"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                      />
                    </div>

                    <div className="flex flex-row gap-x-6 items-start mb-4">
                      <button className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all cursor-poiter">
                        Completed
                      </button>

                      <button className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-green-300 to-green-400 hover:from-green-400 hover:to-green-500 transition-all cursor-poiter">
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex-col w-full px-8 gap-y-6 border-gray-200 rounded-lg sm:flex-row">
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md border-l-4 border-green-500">
                    <h2 className="text-lg !font-bold text-center !text-gray-700 mb-4">
                      Current Todos
                    </h2>
                    <div className="w-full bg-white px-2 rounded-xl shadow-md border-l-4 border-purple-500">
                      <span className="text-base pt-2 font-bold text-gray-800 block ">
                        Title here
                      </span>
                      <span className="text-gray-600 text-sm">
                        Description here
                      </span>
                      <div className="flex items-center justify-start py-1 gap-x-6">
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                          HIGH
                        </span>
                        <span className="text-sm text-gray-500">
                          Created: 9/18/2025, 10:03:18 PM
                        </span>
                      </div>

                      {/* ID */}
                      <span className="text-xs text-gray-400 !mt-2">
                        ID: 51569050-ab8d-44c0-b6da-27225dab276e
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="w-full p-6 bg-gray-100 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <h2 className="text-lg !font-bold text-center !text-gray-700 mb-4">
                      Real-time Notifications
                    </h2>

                    <div className="w-full bg-white px-2 py-2 rounded-xl shadow-md border-l-4 border-purple-500">
                      <div className="flex items-center justify-between py-1 gap-x-6">
                        <span className="text-base pt-2 font-bold text-gray-800 block ">
                          Todo Created
                        </span>
                        <span className="text-sm text-gray-500">
                          10:03:18 PM
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 gap-x-6">
                      <span className="text-gray-600 text-sm block">
                        New Todo Create: Todo Title
                      </span>
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                          HIGH
                        </span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
