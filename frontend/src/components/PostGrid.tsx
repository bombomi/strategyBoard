import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import axios from 'axios';
import type { Post, LoadingStrategy } from '../types/Post';

const PostGrid = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [strategy, setStrategy] = useState<LoadingStrategy>('paging');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const MAX_POSTS = 1000; // 최대 유지할 게시글 수

  const fetchPosts = async (pageNum: number, isNewStrategy: boolean = false, size: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/board?page=${pageNum}&size=${size}&strategy=${strategy}`;
      
      // 무한스크롤의 경우 cursorId 추가
      if (strategy === 'infinite' && posts.length > 0 && !isNewStrategy) {
        const lastPost = posts[posts.length - 1];
        url += `&cursorId=${lastPost.id}`;
      }
      
      console.log('Fetching:', url);
      const response = await axios.get<Post[]>(url);
      console.log('Response:', response.data);
      
      if (response.data.length === 0) {
        setHasMore(false);
        return [];
      }
      
      // 페이징 전략의 경우 총 페이지 수 계산 (임시로 5000개 게시글 기준)
      if (strategy === 'paging') {
        const estimatedTotal = 50000; // 실제로는 백엔드에서 총 개수를 받아와야 함
        setTotalElements(estimatedTotal);
        setTotalPages(Math.ceil(estimatedTotal / size));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('데이터를 불러오는데 실패했습니다.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 메모리 관리를 위한 데이터 정리 함수
  const cleanupPosts = useCallback((newPosts: Post[]) => {
    if (strategy !== 'infinite') return newPosts;
    
    const container = scrollContainerRef.current;
    if (!container) return newPosts;

    const { scrollTop } = container;
    const isScrollingUp = scrollTop < 100; // 상단에 가까울 때

    if (isScrollingUp) {
      // 스크롤이 위에 있을 때는 데이터 유지
      return newPosts;
    } else {
      // 스크롤이 아래에 있을 때는 최대 개수 제한
      return newPosts.slice(-MAX_POSTS);
    }
  }, [strategy]);

  const loadData = async (pageNum: number, isNewStrategy: boolean = false) => {
    const newPosts = await fetchPosts(pageNum, isNewStrategy);
    
    if (strategy === 'paging' || isNewStrategy) {
      setPosts(newPosts);
    } else {
      setPosts((prev: Post[]) => {
        const combined = [...prev, ...newPosts];
        return cleanupPosts(combined);
      });
    }
  };

  // 무한스크롤: 스크롤이 없으면 자동으로 추가 데이터 패칭
  const ensureScrollable = useCallback(async () => {
    if (strategy !== 'infinite') return;
    const container = scrollContainerRef.current;
    if (!container) return;

    // 스크롤이 생기지 않을 때만 추가 패칭
    while (container.scrollHeight <= container.clientHeight && hasMore) {
      // 1회 패칭마다 100개씩 요청
      const newPosts = await fetchPosts(page, false, 100);
      if (newPosts.length === 0) break;
      
      setPosts(prev => {
        const combined = [...prev, ...newPosts];
        return cleanupPosts(combined);
      });
    }
  }, [strategy, hasMore, page, cleanupPosts]);

  // 전략 변경 시 초기 데이터 패칭 (무한스크롤은 100개, 페이징은 10개)
  useEffect(() => {
    const init = async () => {
      setPage(0);
      setHasMore(true);
      if (strategy === 'infinite') {
        setPosts([]);
        // 100개 패칭 후 스크롤이 없으면 추가 패칭
        const firstPosts = await fetchPosts(0, true, 100);
        setPosts(firstPosts);
        setTimeout(ensureScrollable, 0);
      } else {
        const firstPosts = await fetchPosts(0, true, 10);
        setPosts(firstPosts);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy]);

  const handleStrategyChange = (_: React.MouseEvent<HTMLElement>, newStrategy: LoadingStrategy) => {
    if (newStrategy !== null) {
      setStrategy(newStrategy);
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  };

  const handlePrevPage = () => {
    if (page > 0) {
      const prevPage = page - 1;
      setPage(prevPage);
      loadData(prevPage);
    }
  };

  // Material-UI Pagination 컴포넌트용 핸들러
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const newPage = value - 1; // Material-UI는 1부터 시작, 우리는 0부터 시작
    setPage(newPage);
    loadData(newPage);
  };

  // 무한스크롤을 위한 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (strategy !== 'infinite' || loading || !hasMore) {
      console.log('스크롤 이벤트 무시:', { strategy, loading, hasMore });
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      console.log('스크롤 컨테이너를 찾을 수 없음');
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    console.log('스크롤 정보:', {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollPercentage: Math.round(scrollPercentage * 100) + '%'
    });
    
    // 스크롤이 80% 지점에 도달했을 때 다음 데이터 로드
    if (scrollPercentage >= 0.8) {
      console.log('무한스크롤 트리거! 다음 페이지 로드');
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }

    // 스크롤 위치에 따라 데이터 정리
    setPosts(prev => cleanupPosts(prev));
  }, [strategy, loading, hasMore, page, cleanupPosts]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (strategy === 'infinite' && container) {
      console.log('무한스크롤 이벤트 리스너 등록');
      container.addEventListener('scroll', handleScroll);
      return () => {
        console.log('무한스크롤 이벤트 리스너 제거');
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll, strategy]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            게시판 ({strategy === 'paging' ? `${totalElements}개 게시글` : `${posts.length}개 게시글`}) - {strategy === 'infinite' ? '무한스크롤' : '페이징'} 모드
          </Typography>
          <ToggleButtonGroup
            value={strategy}
            exclusive
            onChange={handleStrategyChange}
            aria-label="loading strategy"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="paging" aria-label="paging">
              페이징
            </ToggleButton>
            <ToggleButton value="infinite" aria-label="infinite scroll">
              무한스크롤
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>
      
      <Box 
        ref={scrollContainerRef}
        sx={{ 
          flex: 1, 
          p: 2, 
          overflow: 'auto',
          maxHeight: 'calc(100vh - 64px)',
          border: strategy === 'infinite' ? '2px solid #1976d2' : 'none' // 디버깅용 테두리
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {strategy === 'infinite' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            스크롤을 아래로 내리면 자동으로 더 많은 게시글이 로드됩니다.
          </Alert>
        )}
        
        {strategy === 'paging' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            페이지 번호를 클릭하여 원하는 페이지로 이동할 수 있습니다.
          </Alert>
        )}
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>내용</TableCell>
                <TableCell>작성자</TableCell>
                <TableCell>작성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.content}
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2, alignSelf: 'center' }}>
              데이터를 불러오는 중...
            </Typography>
          </Box>
        )}
        
        {strategy === 'paging' && !loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
            {/* Material-UI Pagination 컴포넌트 */}
            <Pagination 
              count={totalPages}
              page={page + 1} // Material-UI는 1부터 시작
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              siblingCount={2} // 현재 페이지 양쪽에 보여줄 페이지 수
              boundaryCount={2} // 처음과 끝에 보여줄 페이지 수
            />
            
            {/* 추가 정보 */}
            <Typography variant="body2" color="text.secondary">
              페이지 {page + 1} / {totalPages} (총 {totalElements.toLocaleString()}개 게시글)
            </Typography>
            
            {/* 기존 이전/다음 버튼도 유지 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handlePrevPage} 
                disabled={page === 0 || loading}
              >
                이전
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleNextPage} 
                disabled={page >= totalPages - 1 || loading}
              >
                다음
              </Button>
            </Box>
          </Box>
        )}
        
        {strategy === 'infinite' && !hasMore && posts.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2 }}>
            <Typography color="text.secondary">
              모든 게시글을 불러왔습니다.
            </Typography>
          </Box>
        )}
        
        {/* 디버깅용 정보 */}
        {strategy === 'infinite' && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption">
              디버깅 정보: 페이지 {page + 1}, 로딩 중: {loading ? 'Yes' : 'No'}, 더 있음: {hasMore ? 'Yes' : 'No'}, 현재 데이터: {posts.length}개
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PostGrid; 