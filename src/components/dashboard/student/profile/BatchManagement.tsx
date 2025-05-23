
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UserPlus, Users, CreditCard } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import BatchInvitationInput from '@/components/subscription/BatchInvitationInput';
import InvitationCodeDisplay from '@/components/subscription/batch/InvitationCodeDisplay';

// Mock batch data
const initialBatches = [
  {
    id: "batch-1",
    name: "Physics Study Group",
    members: 8,
    joinedOn: "2023-09-15",
    isAdmin: true,
  },
  {
    id: "batch-2",
    name: "JEE Chemistry Masters",
    members: 12,
    joinedOn: "2023-10-02",
    isAdmin: false,
  }
];

interface BatchType {
  id: string;
  name: string;
  members: number;
  joinedOn: string;
  isAdmin: boolean;
  inviteCode?: string;
}

interface BatchManagementProps {
  hasSubscription?: boolean;
}

const BatchManagement: React.FC<BatchManagementProps> = ({ hasSubscription = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [batchCode, setBatchCode] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [currentBatches, setCurrentBatches] = useState<BatchType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchType | null>(null);
  const [showInviteCodeDialog, setShowInviteCodeDialog] = useState(false);
  
  // Check if user has a subscription that supports batch creation
  const checkHasGroupPlan = () => {
    if (!user || !user.subscription) return hasSubscription;
    
    const planType = typeof user.subscription === 'string' 
      ? user.subscription 
      : user.subscription.planType;
      
    return planType?.toString().includes('group') || planType === 'premium' || hasSubscription;
  };
  
  const userHasGroupPlan = checkHasGroupPlan();

  // Load batches on component mount
  useEffect(() => {
    // In a real app, you would fetch this from an API
    // For now, let's use the mock data
    const savedBatches = localStorage.getItem('prepzr_user_batches');
    if (savedBatches) {
      try {
        setCurrentBatches(JSON.parse(savedBatches));
      } catch (error) {
        console.error("Error parsing saved batches:", error);
        setCurrentBatches(initialBatches);
      }
    } else {
      setCurrentBatches(initialBatches);
    }
  }, []);

  // Save batches to localStorage when they change
  useEffect(() => {
    if (currentBatches.length > 0) {
      localStorage.setItem('prepzr_user_batches', JSON.stringify(currentBatches));
    }
  }, [currentBatches]);

  const handleJoinBatch = () => {
    if (!batchCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid batch code",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call to join batch
    toast({
      title: "Joining batch...",
      description: "Processing your request"
    });

    // Simulate successful join after delay
    setTimeout(() => {
      const newBatch = {
        id: `batch-${Date.now()}`,
        name: `Study Group ${Math.floor(Math.random() * 100)}`,
        members: Math.floor(Math.random() * 10) + 5,
        joinedOn: new Date().toISOString().split('T')[0],
        isAdmin: false
      };

      setCurrentBatches(prev => [...prev, newBatch]);
      
      toast({
        title: "Success!",
        description: `You've joined "${newBatch.name}"`,
      });
      
      setBatchCode('');
      setShowJoinDialog(false);
      setIsProcessing(false);
    }, 1500);
  };

  const handleJoinWithCode = async (code: string) => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid batch code",
        variant: "destructive"
      });
      return Promise.reject("Invalid code");
    }

    // Simulate API call to join batch
    toast({
      title: "Joining batch...",
      description: "Processing your request"
    });

    // Simulate network request
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Generate a random name for the batch
        const groupNames = ["Physics Masters", "Chemistry Champions", "Biology Experts", "Math Wizards", "NEET Preparation"];
        const randomName = groupNames[Math.floor(Math.random() * groupNames.length)];
        
        const newBatch = {
          id: `batch-${Date.now()}`,
          name: randomName,
          members: Math.floor(Math.random() * 10) + 5,
          joinedOn: new Date().toISOString().split('T')[0],
          isAdmin: false
        };

        setCurrentBatches(prev => [...prev, newBatch]);
        
        toast({
          title: "Success!",
          description: `You've joined "${newBatch.name}"`,
        });
        
        resolve();
      }, 1500);
    });
  };

  const handleCreateBatch = () => {
    if (!newBatchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a batch name",
        variant: "destructive"
      });
      return;
    }

    if (!userHasGroupPlan) {
      setShowCreateDialog(false);
      setShowSubscribeDialog(true);
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call to create batch
    toast({
      title: "Creating batch...",
      description: "Setting up your new study group"
    });

    // Simulate successful creation after delay
    setTimeout(() => {
      const batchId = `batch-${Date.now()}`;
      const inviteCode = `SAKHA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const newBatch: BatchType = {
        id: batchId,
        name: newBatchName,
        members: 1,
        joinedOn: new Date().toISOString().split('T')[0],
        isAdmin: true,
        inviteCode: inviteCode
      };

      setCurrentBatches(prev => [...prev, newBatch]);
      setSelectedBatch(newBatch);
      
      toast({
        title: "Batch Created!",
        description: `"${newBatchName}" has been created successfully`,
      });
      
      setNewBatchName('');
      setShowCreateDialog(false);
      setIsProcessing(false);
      setShowInviteCodeDialog(true);
    }, 1500);
  };

  const handleLeaveBatch = (batchId: string) => {
    // Simulate API call to leave batch
    toast({
      title: "Leaving batch...",
      description: "Processing your request"
    });

    // Simulate successful leave after delay
    setTimeout(() => {
      setCurrentBatches(prev => prev.filter(batch => batch.id !== batchId));
      
      toast({
        title: "Batch Left",
        description: "You have successfully left the batch",
      });
    }, 1000);
  };

  const handleUpgradeSubscription = () => {
    setShowSubscribeDialog(false);
    navigate('/dashboard/student/subscription');
  };

  const handleShowInviteCode = (batch: BatchType) => {
    setSelectedBatch(batch);
    
    // If invite code doesn't exist, generate one
    if (!batch.inviteCode) {
      const updatedBatches = currentBatches.map(b => {
        if (b.id === batch.id) {
          return {
            ...b,
            inviteCode: `SAKHA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          };
        }
        return b;
      });
      
      setCurrentBatches(updatedBatches);
      setSelectedBatch(updatedBatches.find(b => b.id === batch.id) || null);
    }
    
    setShowInviteCodeDialog(true);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Batch Management</CardTitle>
        <CardDescription>Join or create study groups with other students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6">
          <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus size={16} />
                Join Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Batch</DialogTitle>
                <DialogDescription>
                  Enter the batch code provided by your batch admin to join a study group.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="batchCode">Batch Code</Label>
                  <Input
                    id="batchCode"
                    placeholder="Enter batch code (e.g., SAKHA-ABC123)"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowJoinDialog(false)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button onClick={handleJoinBatch} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Join Batch"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Create Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Batch</DialogTitle>
                <DialogDescription>
                  {userHasGroupPlan 
                    ? "Create a new study batch and invite others to join."
                    : "You need a Group Plan subscription to create a batch."}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                {!userHasGroupPlan && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                    Please upgrade to a Group Plan to create and manage your own batches.
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="batchName">Batch Name</Label>
                  <Input
                    id="batchName"
                    placeholder="Enter batch name"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBatch} 
                  disabled={!userHasGroupPlan || isProcessing}
                >
                  {isProcessing ? "Processing..." : (userHasGroupPlan ? "Create Batch" : "Upgrade to Create")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upgrade to Group Plan</DialogTitle>
                <DialogDescription>
                  Unlock batch creation and management features to study with your friends.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3">
                  <h3 className="font-medium">Group Plan Benefits:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="rounded-full bg-green-500 text-white h-4 w-4 flex items-center justify-center text-xs">✓</div>
                      Create and manage your own study batches
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="rounded-full bg-green-500 text-white h-4 w-4 flex items-center justify-center text-xs">✓</div>
                      Invite up to 10 members per batch
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="rounded-full bg-green-500 text-white h-4 w-4 flex items-center justify-center text-xs">✓</div>
                      Track group progress and performance
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="rounded-full bg-green-500 text-white h-4 w-4 flex items-center justify-center text-xs">✓</div>
                      Share study materials and notes with batch members
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-md">
                  <div className="font-medium text-center mb-2">Group Plan</div>
                  <div className="text-2xl font-bold text-center mb-1">₹499/month</div>
                  <div className="text-sm text-center text-gray-600 dark:text-gray-400">or ₹4,999/year (save 16%)</div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowSubscribeDialog(false)}>
                  Not Now
                </Button>
                <Button 
                  onClick={handleUpgradeSubscription}
                  className="gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Upgrade Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showInviteCodeDialog} onOpenChange={setShowInviteCodeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Batch Invitation</DialogTitle>
                <DialogDescription>
                  Share this invitation code with others to join your batch
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {selectedBatch && selectedBatch.inviteCode && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Batch Name</Label>
                      <p className="font-medium">{selectedBatch.name}</p>
                    </div>
                    
                    <InvitationCodeDisplay inviteCode={selectedBatch.inviteCode} />
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Share this code with others so they can join your batch by clicking "Join Batch" and entering this code.</p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setShowInviteCodeDialog(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <BatchInvitationInput onJoinBatch={handleJoinWithCode} />
        </div>

        {currentBatches.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Your Current Batches</h3>
            {currentBatches.map((batch) => (
              <Card key={batch.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <h4 className="font-medium">{batch.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Users size={14} className="mr-1" />
                        <span>{batch.members} members</span>
                        <span className="mx-2">•</span>
                        <span>Joined: {batch.joinedOn}</span>
                        {batch.isAdmin && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-green-600 font-medium">Admin</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex gap-2">
                      {batch.isAdmin ? (
                        <Button size="sm" variant="outline" onClick={() => handleShowInviteCode(batch)}>
                          Invite Members
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleLeaveBatch(batch.id)}
                        >
                          Leave
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border rounded-md">
            <p className="text-muted-foreground">You haven't joined any batches yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Join a batch to study with others
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BatchManagement;
