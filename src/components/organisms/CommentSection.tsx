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
  return (
    <div className="flex flex-col gap-4 pb-4">
      <CommentArea type="create" />
      {/* The comments created by the current user should be at the top */}
      {comments.length > 0 &&
        [...comments] // Create a shallow copy of the array
          .reverse() // Reverse the copied array
          .map((commentItem) => {
            return (
              <CommentArea
                key={commentItem.id}
                type="display"
                comment={commentItem}
                fetchComments={fetchComments}
              />
            );
          })}
    </div>
  );
};

export default CommentsSection;
