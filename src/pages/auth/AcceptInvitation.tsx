import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAcceptInvitation } from '../../hooks/queries/useMembers';
import { useAppSelector } from '../../redux/hooks';
import Logo from '../../components/ui/logo';
import Button from '../../components/ui/button';
import Spinner from '../../components/ui/spinner';
import { ROUTES } from '../../constants/routes';
import ProjectInvitationIcon from '../../assets/icons/projectInvitation.svg?react';

const INVITATION_TOKEN_KEY = 'invitation_token';
const NAVIGATION_DELAY = {
  SUCCESS: 1500,
  ERROR: 2000,
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-surface-low flex items-center justify-center p-4">
    {children}
  </div>
);

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const user = useAppSelector(state => state.user.data);

  const { mutate: acceptInvitation, isPending } = useAcceptInvitation();

  useEffect(() => {
    if (!user && token) {
      sessionStorage.setItem(INVITATION_TOKEN_KEY, token);
      const returnUrl = `/invite?token=${token}`;
      navigate(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (user && !token) {
      const storedToken = sessionStorage.getItem(INVITATION_TOKEN_KEY);
      if (storedToken) {
        navigate(`/invite?token=${storedToken}`, { replace: true });
        sessionStorage.removeItem(INVITATION_TOKEN_KEY);
      }
    }
  }, [user, token, navigate]);

  const navigateWithDelay = (path: string, delay: number) => {
    setTimeout(() => navigate(path), delay);
  };

  const handleAcceptInvitation = () => {
    if (!token) {
      toast.error('Invalid invitation link');
      return;
    }

    acceptInvitation(
      { p_token: token },
      {
        onSuccess: data => {
          toast.success('Invitation accepted successfully!');
          const destination = data.project_id
            ? ROUTES.PROJECT_MEMBERS(data.project_id)
            : ROUTES.PROJECTS;
          navigateWithDelay(destination, NAVIGATION_DELAY.SUCCESS);
        },
        onError: error => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to accept invitation';
          toast.error(errorMessage);
          navigateWithDelay(ROUTES.PROJECTS, NAVIGATION_DELAY.ERROR);
        },
      }
    );
  };

  if (!user && token) {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    );
  }

  if (!token) {
    return (
      <PageContainer>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-heading-lg text-slate-dark font-semibold mb-4">
            Invalid Invitation Link
          </h2>
          <p className="text-body-md text-slate-medium mb-6">
            This invitation link is invalid or has been removed.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.PROJECTS)}
            className="w-full"
          >
            Go to Projects
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen bg-surface-low flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-1 bg-primary" />

          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                <ProjectInvitationIcon className="w-4 h-4 text-primary" />
                <span className="text-label-sm text-primary font-semibold uppercase tracking-wide">
                  New Project Invitation
                </span>
              </div>
            </div>

            <h1 className="text-heading-2xl text-slate-dark font-bold leading-tight mb-8">
              You've been invited to join new project
            </h1>

            <Button
              variant="primary"
              onClick={handleAcceptInvitation}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? 'Accepting...' : 'Accept Invitation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
