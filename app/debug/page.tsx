'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/footer';

export default function DebugPage() {
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function runDiagnostics() {
            const diagnostics: any = {};

            // Test 1: Environment Variables
            diagnostics.envVars = {
                NOTION_TOKEN: process.env.NOTION_TOKEN ? 'EXISTS' : 'MISSING',
                NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || 'MISSING',
                NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'MISSING'
            };

            // Test 2: Direct API Test
            try {
                console.log('🔍 Testing /api/blog...');
                const apiResponse = await fetch('/api/blog', { cache: 'no-store' });
                const apiData = await apiResponse.json();
                diagnostics.apiTest = {
                    status: apiResponse.status,
                    statusText: apiResponse.statusText,
                    data: apiData
                };
                console.log('📊 API Response:', apiData);
            } catch (error) {
                console.error('❌ API Test Error:', error);
                diagnostics.apiTest = { error: error instanceof Error ? error.message : 'Unknown error' };
            }

            // Test 3: Direct Notion Test
            try {
                console.log('🔍 Testing direct Notion connection...');
                const notionResponse = await fetch('/api/debug-notion', { cache: 'no-store' });
                const notionData = await notionResponse.json();
                diagnostics.notionTest = notionData;
                console.log('📊 Notion Test:', notionData);
            } catch (error) {
                console.error('❌ Notion Test Error:', error);
                diagnostics.notionTest = { error: error instanceof Error ? error.message : 'Unknown error' };
            }

            setResults(diagnostics);
            setLoading(false);
        }

        runDiagnostics();
    }, []);

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">🔍 Running Complete Diagnostics...</h1>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto page-content">
            <h1 className="text-3xl font-bold mb-6">🔍 Complete Blog Diagnostics</h1>

            <div className="space-y-6">
                {/* Environment Variables */}
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        🔧 Environment Variables
                        {results.envVars?.NOTION_TOKEN === 'EXISTS' && results.envVars?.NOTION_DATABASE_ID !== 'MISSING' ?
                            <span className="ml-2 text-green-600">✅</span> :
                            <span className="ml-2 text-red-600">❌</span>
                        }
                    </h2>
                    <pre className="text-sm overflow-auto bg-white dark:bg-black p-4 rounded border">
                        {JSON.stringify(results.envVars, null, 2)}
                    </pre>
                </div>

                {/* API Response */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        📡 API Response (/api/blog)
                        {results.apiTest?.status === 200 ?
                            <span className="ml-2 text-green-600">✅</span> :
                            <span className="ml-2 text-red-600">❌</span>
                        }
                    </h2>
                    {results.apiTest?.status && (
                        <div className="mb-4 p-3 bg-white dark:bg-black rounded">
                            <p><strong>Status:</strong> {results.apiTest.status} {results.apiTest.statusText}</p>
                            {results.apiTest.data?.posts && (
                                <p><strong>Posts Found:</strong> {results.apiTest.data.posts.length}</p>
                            )}
                            {results.apiTest.data?.debug && (
                                <p><strong>Debug Info:</strong> {JSON.stringify(results.apiTest.data.debug)}</p>
                            )}
                        </div>
                    )}
                    <details>
                        <summary className="cursor-pointer font-medium mb-2">Full API Response (Click to expand)</summary>
                        <pre className="text-sm overflow-auto bg-white dark:bg-black p-4 rounded border max-h-96">
                            {JSON.stringify(results.apiTest, null, 2)}
                        </pre>
                    </details>
                </div>

                {/* Direct Notion Test */}
                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        🗄️ Direct Notion Connection Test
                        {results.notionTest?.connectionTest === 'SUCCESS' ?
                            <span className="ml-2 text-green-600">✅</span> :
                            <span className="ml-2 text-red-600">❌</span>
                        }
                    </h2>

                    {results.notionTest?.connectionTest && (
                        <div className="mb-4 space-y-2">
                            <p><strong>Connection:</strong> {results.notionTest.connectionTest}</p>
                            {results.notionTest.totalPages !== undefined && (
                                <p><strong>Total Pages:</strong> {results.notionTest.totalPages}</p>
                            )}
                            {results.notionTest.availableProperties && (
                                <div>
                                    <p><strong>Available Properties:</strong></p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {results.notionTest.availableProperties.map((prop: string) => (
                                            <span key={prop} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                {prop}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {results.notionTest.missingProperties && (
                                <div>
                                    <p><strong className="text-red-600">Missing Properties:</strong></p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {results.notionTest.missingProperties.map((prop: string) => (
                                            <span key={prop} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                                {prop}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <details>
                        <summary className="cursor-pointer font-medium mb-2">Full Notion Test Results (Click to expand)</summary>
                        <pre className="text-sm overflow-auto bg-white dark:bg-black p-4 rounded border max-h-96">
                            {JSON.stringify(results.notionTest, null, 2)}
                        </pre>
                    </details>
                </div>

                {/* Summary & Next Steps */}
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">📋 Summary & Next Steps</h2>
                    <div className="space-y-2">
                        {results.envVars?.NOTION_TOKEN !== 'EXISTS' && (
                            <p className="text-red-600">❌ NOTION_TOKEN is missing - Check your .env.local file</p>
                        )}
                        {results.envVars?.NOTION_DATABASE_ID === 'MISSING' && (
                            <p className="text-red-600">❌ NOTION_DATABASE_ID is missing - Check your .env.local file</p>
                        )}
                        {results.apiTest?.status !== 200 && (
                            <p className="text-red-600">❌ API endpoint is failing - Check server logs</p>
                        )}
                        {results.notionTest?.connectionTest !== 'SUCCESS' && (
                            <p className="text-red-600">❌ Notion connection failed - Check token and database ID</p>
                        )}
                        {results.notionTest?.totalPages === 0 && (
                            <p className="text-orange-600">⚠️ No pages found in database - Check if integration is connected</p>
                        )}
                        {results.notionTest?.missingProperties?.length > 0 && (
                            <p className="text-orange-600">⚠️ Missing required properties in Notion database</p>
                        )}

                        {results.envVars?.NOTION_TOKEN === 'EXISTS' &&
                            results.envVars?.NOTION_DATABASE_ID !== 'MISSING' &&
                            results.apiTest?.status === 200 &&
                            results.notionTest?.connectionTest === 'SUCCESS' &&
                            results.notionTest?.totalPages > 0 && (
                                <p className="text-green-600">✅ All systems appear to be working! Check individual post data.</p>
                            )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}