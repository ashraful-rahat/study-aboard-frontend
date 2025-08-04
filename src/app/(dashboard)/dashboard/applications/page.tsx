"use client";

import React, { useState, useEffect } from 'react';
import { applicationService } from '@/utils/applicationService';
import { Application, University, Destination, Course } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsData, universitiesData, destinationsData, coursesData] = await Promise.all([
          applicationService.getAllApplications(),
          applicationService.getAllUniversities(),
          applicationService.getAllDestinations(),
          applicationService.getAllCourses()
        ]);
        
        setApplications(applicationsData);
        setUniversities(universitiesData);
        setDestinations(destinationsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions to get related data
  const getUniversityName = (universityId: string) => {
    const university = universities.find(u => u._id === universityId);
    return university?.name || 'Unknown University';
  };

  const getDestinationName = (destinationId: string | undefined) => {
    if (!destinationId) return 'Unknown Destination';
    const destination = destinations.find(d => d._id === destinationId);
    return destination?.name || 'Unknown Destination';
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    return course?.name || 'Unknown Course';
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      app.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUniversityName(app.university).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Update application status
  const updateApplicationStatus = async (applicationId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await applicationService.updateApplication(applicationId, { status: newStatus });
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Delete application
  const deleteApplication = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationService.deleteApplication(applicationId);
        setApplications(prev => prev.filter(app => app._id !== applicationId));
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications Management</h1>
        <p className="text-gray-600">Manage and review study abroad applications</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              type="text"
              placeholder="Search by student number, email, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {application.photo && (
                        <img
                          className="h-10 w-10 rounded-full mr-3"
                          src={application.photo}
                          alt="Student"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.studentNumber || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{getUniversityName(application.university)}</div>
                      <div className="text-gray-500">{getCourseName(application.course)}</div>
                                             <div className="text-gray-500">{getDestinationName(application.destination)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>SSC: {application.sscResult || 'N/A'}</div>
                      <div>HSC: {application.hscResult || 'N/A'}</div>
                      <div>IELTS: {application.ieltsResult || 'N/A'}</div>
                      <div className="capitalize">{application.background}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      application.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetails(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                      >
                        View
                      </Button>
                      <Select
                        value={application.status}
                        onValueChange={(value) => updateApplicationStatus(application._id, value as any)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => deleteApplication(application._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <Button
                  onClick={() => setShowDetails(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student Number</label>
                    <p className="text-sm text-gray-900">{selectedApplication.studentNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedApplication.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">University</label>
                    <p className="text-sm text-gray-900">{getUniversityName(selectedApplication.university)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course</label>
                    <p className="text-sm text-gray-900">{getCourseName(selectedApplication.course)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                                     <div>
                     <label className="block text-sm font-medium text-gray-700">Destination</label>
                     <p className="text-sm text-gray-900">{getDestinationName(selectedApplication.destination)}</p>
                   </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Background</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedApplication.background}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SSC Result</label>
                    <p className="text-sm text-gray-900">{selectedApplication.sscResult || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">HSC Result</label>
                    <p className="text-sm text-gray-900">{selectedApplication.hscResult || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IELTS Score</label>
                    <p className="text-sm text-gray-900">{selectedApplication.ieltsResult || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Other Test Score</label>
                    <p className="text-sm text-gray-900">{selectedApplication.scoreResult || 'N/A'}</p>
                  </div>
                </div>
                
                {selectedApplication.photo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                    <img
                      src={selectedApplication.photo}
                      alt="Student"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedApplication.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : selectedApplication.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedApplication.status}
                  </span>
                </div>
                
                {selectedApplication.remarks && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Remarks</label>
                    <p className="text-sm text-gray-900">{selectedApplication.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
