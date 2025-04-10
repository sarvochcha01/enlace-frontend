import { LoaderCircle, Send, Edit, Trash2, X, Clock } from "lucide-react";
import Button from "./Button";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/tailwindMerge";
import { CommentService } from "../../services/CommentService";
import { CommentResponseDTO } from "../../models/dtos/Comment";
import { useProject } from "../../hooks/useProject";
import { useTaskModal } from "../../hooks/useTaskModal";
import { formatDateAndTime } from "../../utils/dateUtils";
import { getInitials, getNameColor } from "../../utils/nameUtils";

interface CommentAreaProps {
  type: "display" | "create";
  comment?: CommentResponseDTO;
  fetchComments?: () => void;
}

const CommentArea: React.FC<CommentAreaProps> = ({
  type,
  comment,
  fetchComments,
}) => {
  const { project, projectMember, getProjectMemberData } = useProject();
  const { taskId } = useTaskModal();

  const isCommentEdited = comment?.updatedAt !== comment?.createdAt;
  const isSelfComment = comment?.createdBy === projectMember?.id;
  const creator = getProjectMemberData(comment?.createdBy!);

  const [commentText, setCommentText] = useState("");
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentInputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === "display" && isEditing && comment) {
      setEditText(comment.comment || "");

      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }
    }
  }, [isEditing, comment, type]);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      commentInputContainerRef.current &&
      !commentInputContainerRef.current.contains(e.target as Node)
    ) {
      if (type === "create") {
        setIsFocused(false);
      } else if (isEditing) {
        setIsEditing(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handlePostComment = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!commentText.trim()) return;

    setIsLoading(true);
    try {
      await CommentService.createComment({
        comment: commentText,
        projectId: project?.id!,
        taskId: taskId!,
      });

      setCommentText("");
      setIsFocused(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      fetchComments?.();
    }
  };

  const handleEditComment = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!editText.trim() || !comment?.id) return;

    setIsLoading(true);
    try {
      await CommentService.updateComment(comment.id, {
        comment: editText,
        projectId: project?.id!,
        taskId: taskId!,
      });

      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      fetchComments?.();
    }
  };

  const handleDeleteComment = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!comment?.id) return;

    setIsDeleting(true);
    try {
      await CommentService.deleteComment(project?.id!, taskId!, comment.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
      fetchComments?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: "post" | "edit") => {
    e.stopPropagation();

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action === "post" ? handlePostComment() : handleEditComment();
    }
  };

  return (
    <div
      className={cn(
        "flex w-full rounded-lg overflow-hidden",
        type === "display" ? "bg-white border border-gray-200" : "",
        type === "display" && isEditing ? "shadow-md" : "",
        type === "create" && isFocused ? "shadow-md" : ""
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 pl-4">
        <div
          className={`bg-gradient-to-br ${getNameColor(
            creator?.name || projectMember?.name || ""
          )} w-9 h-9 rounded-full flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0`}
        >
          {getInitials(creator?.name || projectMember?.name || "")}
        </div>
      </div>

      <div className="flex-1 p-3 pr-4" ref={commentInputContainerRef}>
        {type === "create" ? (
          <div className="flex flex-col w-full">
            {isFocused && (
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">
                  {projectMember?.name}
                </span>
              </div>
            )}

            <textarea
              ref={textareaRef}
              className={cn(
                "w-full p-3 rounded-lg resize-none transition-all",
                "focus:outline-none focus:ring-1 focus:ring-blue-400",
                "placeholder:text-gray-400",
                isFocused
                  ? "border border-gray-200 bg-gray-50 h-24"
                  : "bg-gray-100 h-12"
              )}
              placeholder="Write a comment..."
              onFocus={() => setIsFocused(true)}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "post")}
            />

            {isFocused && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1.5 rounded hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFocused(false);
                    setCommentText("");
                  }}
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 rounded transition-colors ${
                    !commentText.trim() || isLoading
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }`}
                  disabled={!commentText.trim() || isLoading}
                  onClick={handlePostComment}
                >
                  {isLoading ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  <span>Post</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">
                  {creator?.name}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDateAndTime(comment?.createdAt!)}
                  {isCommentEdited && <span className="italic">(edited)</span>}
                </span>
              </div>
            </div>

            {isEditing ? (
              <div className="flex flex-col">
                <textarea
                  ref={textareaRef}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "edit")}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1.5 rounded hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(false);
                    }}
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 rounded transition-colors ${
                      !editText.trim() || isLoading
                        ? "opacity-60 pointer-events-none"
                        : ""
                    }`}
                    disabled={!editText.trim() || isLoading}
                    onClick={handleEditComment}
                  >
                    {isLoading ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="whitespace-pre-wrap text-gray-700 pt-1 pb-3">
                  {comment?.comment}
                </div>

                {isSelfComment && (
                  <div className="flex gap-4 mt-1 border-t pt-2 text-xs text-gray-500">
                    <button
                      className="flex items-center gap-1 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="flex items-center gap-1 hover:text-red-600"
                      onClick={handleDeleteComment}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <LoaderCircle size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentArea;
