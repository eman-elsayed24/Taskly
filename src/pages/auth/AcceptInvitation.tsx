import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAcceptInvitation } from '../../hooks/queries/useMembers';
import { useAppSelector } from '../../redux/hooks';
import Logo from '../../components/ui/logo';
import Button from '../../components/ui/button';
import Spinner from '../../components/ui/spinner';
import { ROUTES } from '../../constants/routes';
import CheckCircleIcon from '../../assets/icons/checkCircle.svg?react';

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const user = useAppSelector(state => state.user.user);
  const [projectName, setProjectName] = useState('new project');

  const { mutate: acceptInvitation, isPending } = useAcceptInvitation();

  // Check authentication 
  useEffect(() => {
    if (!user && token) {
   
      sessionStorage.setItem('invitation_token', token);
      const returnUrl = `/invite?token=${token}`;
      navigate(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, token, navigate]);


  useEffect(() => {
    if (user && !token) {
      const storedToken = sessionStorage.getItem('invitation_token');
      if (storedToken) {
        navigate(`/invite?token=${storedToken}`, { replace: true });
        sessionStorage.removeItem('invitation_token');
      }
    }
  }, [user, token, navigate]);

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

          // Update project name if returned from API
          if (data.project_name) {
            setProjectName(data.project_name);
          }

          // Redirect to project members page if project_id is available
          if (data.project_id) {
            setTimeout(() => {
              navigate(ROUTES.PROJECT_MEMBERS(data.project_id));
            }, 1500);
          } else {
           
            setTimeout(() => {
              navigate(ROUTES.PROJECTS);
            }, 1500);
          }
        },
        onError: error => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to accept invitation';

          toast.error(errorMessage);

          // Redirect to projects page after error
          setTimeout(() => {
            navigate(ROUTES.PROJECTS);
          }, 2000);
        },
      }
    );
  };


  if (!user && token) {
    return (
      <div className="min-h-screen bg-surface-low flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }


  if (!token) {
    return (
      <div className="min-h-screen bg-surface-low flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <Logo className="mx-auto mb-6" />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
         
          <div className="h-1 bg-primary" />

          <div className="p-8">
           
            <Logo className="mx-auto mb-8" />

           
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                <CheckCircleIcon className="w-4 h-4 text-primary" />
                <span className="text-label-sm text-primary font-semibold uppercase tracking-wide">
                  New Project Invitation
                </span>
              </div>
            </div>

          
            <h1 className="text-heading-xl text-slate-dark font-semibold text-center mb-2">
              You've been invited to join
            </h1>
            <p className="text-heading-lg text-primary text-center mb-8">
              {projectName}
            </p>

           
            <Button
              variant="primary"
              onClick={handleAcceptInvitation}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? 'Accepting...' : 'Accept Invitation'}
            </Button>

            
            <p className="text-body-sm text-slate-medium text-center mt-6">
              By accepting this invitation, you'll be added as a member of the
              project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
