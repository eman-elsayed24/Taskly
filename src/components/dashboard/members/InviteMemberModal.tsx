import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Modal, { ModalHeader, ModalContent } from '../../ui/Modal';
import FormField from '../../ui/FormField';
import Button from '../../ui/button';
import { useInviteMember } from '../../../hooks/queries/useMembers';
import {
  inviteMemberSchema,
  type InviteMemberFormData,
} from '../../../lib/validations/inviteMemberSchema';
import PersonAddIcon from '../../../assets/icons/person-add.svg?react';
import MailIcon from '../../../assets/icons/mail.svg?react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName?: string;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  projectId,
  projectName,
}: InviteMemberModalProps) {
  const { mutate: inviteMember, isPending } = useInviteMember();

  const { control, handleSubmit, reset } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: InviteMemberFormData) => {
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const appUrl = window.location.origin;

    inviteMember(
      {
        p_email: data.email,
        p_project_id: projectId,
        p_app_url: appUrl,
        p_base_url: baseUrl,
      },
      {
        onSuccess: () => {
          toast.success(`Invitation sent successfully to ${data.email}`);
          handleClose();
        },
        onError: error => {
          toast.error(
            error instanceof Error ? error.message : 'Failed to send invitation'
          );
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="md"
      variant="bottomSheet"
    >
      <ModalHeader onClose={handleClose}>
        <div className="flex items-center gap-3">
          <div className="  w-12 h-12 rounded-lg bg-primary/10  hidden md:flex items-center justify-center">
            <PersonAddIcon className="  w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-heading-lg text-slate-dark font-semibold">
              Invite Team Member
            </h2>
            <p className="text-body-sm text-slate-medium mt-1">
              Send an invitation to join{' '}
              {projectName ? `the ${projectName}` : 'this'} workspace
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <FormField
              control={control}
              name="email"
              type="email"
              label="EMAIL ADDRESS"
              placeholder="Enter email address"
              autoFocus
              disabled={isPending}
            />
            <div className="absolute right-3 top-[38px] pointer-events-none">
              <MailIcon className="w-5 h-5 text-slate-medium" />
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isPending}
              className="w-full md:flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="w-full md:flex-1"
            >
              {isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
