"use client"

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import { Application } from '@/types/application';
import { getApplicationById, updateApplication } from "@/services/application-service";
import { useRouter } from 'next/navigation';

const EditApplicationDialog = ({ selectedId, isEditOpen, onClose }: { isEditOpen: boolean; onClose: () => void; selectedId: string }) => {
    const { toast } = useToast();
    const router = useRouter();

    const [company, setCompany] = useState('');
    const [url, setUrl] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [requirements, setRequirements] = useState('');
    const [appliedThrough, setAppliedThrough] = useState('');
    const [salary, setSalary] = useState('');
    const [locationType, setLocationType] = useState('');
    const [location, setLocation] = useState('');
    const [dateApplied, setDateApplied] = useState<Date | null>(null);
    const [status, setStatus] = useState('');
    const [latestReply, setLatestReply] = useState('');
    const [interviewDate, setInterviewDate] = useState<Date | null>(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchApplication = async () => {
            if (selectedId) {
                try {
                    const application = await getApplicationById(selectedId);
                    if (application) {
                        setCompany(application.company || '');
                        setUrl(application.url || '');
                        setJobTitle(application.jobTitle || '');
                        setRequirements(application.requirements || '');
                        setAppliedThrough(application.appliedThrough || '');
                        setSalary(application.salary?.toString() || '');
                        setLocationType(application.locationType || '');
                        setLocation(application.location || '');
                        setDateApplied(application.dateApplied ? new Date(application.dateApplied) : null);
                        setStatus(application.status || '');
                        setLatestReply(application.latestReply || '');
                        setInterviewDate(application.interviewDate ? new Date(application.interviewDate) : null);
                        setFeedback(application.feedback || '');
                    }
                } catch (error) {
                    console.error('Failed to fetch application:', error);
                    toast({
                        variant: "destructive",
                        title: "Failed to fetch application.",
                        description: new Date().toISOString(),
                    });
                }
            }
        };

        fetchApplication();
    }, [selectedId]);

    const handleUpdateApplication = async () => {
        const application: Application = {
            id: selectedId,
            company,
            url,
            jobTitle,
            requirements,
            appliedThrough,
            salary,
            locationType,
            location,
            dateApplied: dateApplied ? dateApplied.toISOString() : "",
            status,
            latestReply,
            interviewDate: interviewDate ? interviewDate.toISOString() : "",
            feedback,
        };

        try {
            await updateApplication(selectedId, application);
            toast({
                variant: "default",
                title: "Application updated",
                description: new Date().toISOString(),
            });
            onClose();
        } catch (error) {
            console.error('Failed to update application:', error);
            toast({
                variant: "destructive",
                title: "Failed to update application.",
                description: new Date().toISOString(),
            });
        }
    };

    return (
        <Dialog open={isEditOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>Edit Application</DialogTitle>
                    <DialogDescription>
                        Fill in the details to update the application.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                            <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                            <Input id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="appliedThrough" className="block text-sm font-medium text-gray-700 mb-2">Applied Through</label>
                            <Input id="appliedThrough" value={appliedThrough} onChange={(e) => setAppliedThrough(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">Salary (LPA)</label>
                            <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location Type</label>
                            <Select value={locationType} onValueChange={setLocationType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Remote">Remote</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                        <SelectItem value="On-site">On-site</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="locationText" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <Input id="locationText" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700 mb-2">Date Applied</label>
                            <DatePicker value={dateApplied} onChange={setDateApplied} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Wait for reply">Wait for reply</SelectItem>
                                        <SelectItem value="No reply">No reply</SelectItem>
                                        <SelectItem value="Interviewing">Interviewing</SelectItem>
                                        <SelectItem value="Got the Job!">Got the Job!</SelectItem>
                                        <SelectItem value="Maybe later">Maybe later</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                        <SelectItem value="Rejected myself">Rejected myself</SelectItem>
                                        <SelectItem value="No answer">No answer</SelectItem>
                                        <SelectItem value="Negotiating">Negotiating</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="latestReply" className="block text-sm font-medium text-gray-700 mb-2">Latest Reply</label>
                            <Input id="latestReply" value={latestReply} onChange={(e) => setLatestReply(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="interviewDate" className="block text-sm font-medium text-gray-700 mb-2">Interview Date</label>
                            <DatePicker value={interviewDate} onChange={setInterviewDate} />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                            <Input id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleUpdateApplication} className="bg-foreground text-background">
                        Update Application
                    </Button>
                    <Button variant="outline" onClick={onClose} className="text-gray-500">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditApplicationDialog;
