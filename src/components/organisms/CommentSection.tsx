import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { CommentResponseDTO } from "../../models/dtos/Comment";
import CommentArea from "../atoms/CommentArea";

interface CommentsSectionProps {
  comments: CommentResponseDTO[];
  fetchComments: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  fetchComments,
}) => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (sortOrder === "newest") {
      scrollToBottom();
    }
  }, [comments.length, sortOrder]);

  // Sort comments based on current sort order
  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Handle sort change with stopPropagation to prevent modal closing
  const handleSortChange = (
    order: "newest" | "oldest",
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to modal backdrop
    setSortOrder(order);
  };

  return (
    <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-800">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>
        </div>

        {comments.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                className={`text-xs px-3 py-1 rounded ${
                  sortOrder === "newest"
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={(e) => handleSortChange("newest", e)}
              >
                Newest
              </button>
              <button
                className={`text-xs px-3 py-1 rounded ${
                  sortOrder === "oldest"
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={(e) => handleSortChange("oldest", e)}
              >
                Oldest
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="mb-6">
        <CommentArea type="create" fetchComments={fetchComments} />
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4  pr-1 -mr-1">
          {sortedComments.map((commentItem) => (
            <CommentArea
              key={commentItem.id}
              type="display"
              comment={commentItem}
              fetchComments={fetchComments}
            />
          ))}
          <div ref={commentsEndRef} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 bg-gray-50 rounded-lg">
          <MessageSquare size={32} className="mb-3 text-gray-300" />
          <p className="font-medium mb-1">No comments yet</p>
          <p className="text-sm">
            Be the first to leave a comment on this task.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
