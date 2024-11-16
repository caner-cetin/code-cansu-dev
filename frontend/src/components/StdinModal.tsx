import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Submissions } from "@/hooks/useSubmissions";
import { useAppStore } from "@/stores/AppStore";
import { useShallow } from "zustand/react/shallow";
export interface StdinModalProps {
	display: boolean,
	setDisplay: (display: boolean) => void,
}
const StdinModal: React.FC<StdinModalProps> = ({ display, setDisplay }) => {
	const languageId = useAppStore(useShallow((state) => state.languageId));
	const [stdin, setStdin] = useState("");

	return (
		<Dialog open={display} onOpenChange={() => setDisplay(false)}>
			<DialogContent className="bg-[#1e1e1e] border border-[#555568] rounded-md">
				<DialogHeader className="bg-[#211e20] border-b border-[#555568] text-[#e9efec] p-4">
					<DialogTitle>Stdin</DialogTitle>
				</DialogHeader>
				<div className="p-4">
					<Textarea
						value={stdin}
						onChange={(e) => setStdin(e.target.value)}
						placeholder="can be submitted blank"
						className="text-[#a0a08b] border border-[#555568] placeholder-[#a0a08b] placeholder-opacity-50 focus:ring-0 focus:border-[#555568]"
						rows={3}
					/>
				</div>
				<DialogFooter className="bg-[#211e20] border-t border-[#555568] p-4">
					<Button
						variant="outline"
						onClick={() => setDisplay(false)}
						className="bg-[#211e20] text-[#e9efec] border border-[#555568] hover:bg-[#3c3836]"
					>
						Cancel
					</Button>
					<Button
						onClick={() => { Submissions.handleSubmitCode(true); Submissions.handleSubmitStdin(stdin) }}
						className="bg-[#3c3836] text-[#e9efec] border border-[#555568] hover:bg-[#211e20]"
					>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default StdinModal;