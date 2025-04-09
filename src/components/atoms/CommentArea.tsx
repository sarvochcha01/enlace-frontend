import { LoaderCircle, Send, Edit, Trash2, X } from "lucide-react";
import Button from "./Button";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/tailwindMerge";
import { CommentService } from "../../services/CommentService";
import { CommentResponseDTO } from "../../models/dtos/Comment";
import { useProject } from "../../hooks/useProject";
import { useTaskModal } from "../../hooks/useTaskModal";
import { formatDateAndTime } from "../../utils/dateUtils";

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

  const commentInputContainerRef = useRef<HTMLDivElement>(null);

  // Initialize edit text with comment content when editing
  useEffect(() => {
    if (type === "display" && isEditing && comment) {
      setEditText(comment.comment || "");
    }
  }, [isEditing, comment, type]);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      commentInputContainerRef.current &&
      !commentInputContainerRef.current.contains(e.target as Node)
    ) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    setIsLoading(true);
    try {
      await CommentService.createComment({
        comment: commentText,
        projectId: project?.id!,
        taskId: taskId!,
      });

      setCommentText("");
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      fetchComments?.();
    }
  };

  const handleEditComment = async () => {
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

  const handleDeleteComment = async () => {
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action === "post" ? handlePostComment() : handleEditComment();
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2) || ""
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full bg-gray-100 rounded-lg shadow-sm p-4 gap-3 transition-all duration-200",
        type === "display" && "hover:bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
            {getInitials(creator?.name || projectMember?.name || "")}
          </div>

          <div className="flex flex-col">
            <span className="font-medium text-gray-800">
              {creator?.name || projectMember?.name}
            </span>
            {type === "display" && (
              <span className="text-xs text-gray-500">
                {formatDateAndTime(comment?.createdAt!)}
                {isCommentEdited && (
                  <span className="ml-1 italic">(edited)</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full relative" ref={commentInputContainerRef}>
        {type === "create" ? (
          <div className="flex flex-col">
            <textarea
              className={cn(
                "w-full bg-white border border-gray-200 p-3 rounded-lg resize-none transition-all",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                "placeholder:text-gray-400",
                isEditing ? "h-24" : "h-14"
              )}
              placeholder="Write a comment..."
              onFocus={() => setIsEditing(true)}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "post")}
            />

            {isEditing && (
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  icon={<X size={16} />}
                  text="Cancel"
                  bg="no-bg"
                  onClick={() => {
                    setIsEditing(false);
                    setCommentText("");
                  }}
                />
                <Button
                  icon={
                    isLoading ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )
                  }
                  text="Post"
                  disabled={!commentText.trim() || isLoading}
                  onClick={handlePostComment}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            {isEditing ? (
              <div className="flex flex-col">
                <textarea
                  className="w-full bg-white border border-gray-200 p-3 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "edit")}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    icon={<X size={16} />}
                    text="Cancel"
                    bg="no-bg"
                    onClick={() => setIsEditing(false)}
                  />
                  <Button
                    icon={
                      isLoading ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )
                    }
                    text="Save"
                    disabled={!editText.trim() || isLoading}
                    onClick={handleEditComment}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white border border-gray-200 p-3 rounded-lg whitespace-pre-wrap text-gray-700 min-h-10">
                  {comment?.comment}
                </div>

                {isSelfComment && (
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      icon={<Edit size={16} />}
                      text="Edit"
                      bg="no-bg"
                      onClick={() => setIsEditing(true)}
                    />
                    <Button
                      icon={
                        isDeleting ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )
                      }
                      text="Delete"
                      bg="no-bg"
                      onClick={handleDeleteComment}
                      disabled={isDeleting}
                    />
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
