package me.kimbomin.board.service.strategy;

import lombok.RequiredArgsConstructor;
import me.kimbomin.board.domain.Board;
import me.kimbomin.board.dto.BoardResDto;
import me.kimbomin.board.repository.BoardRepository;


import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InfiniteScrollStrategy implements LoadStrategy {
    private final BoardRepository boardRepository;
    private static final long FIRSTPAGE_CURSOR = Long.MAX_VALUE;

    @Override
    public String getStrategyNm(){
        return "infinite";
    }

    @Override
    @Transactional(readOnly = true)
    public List<BoardResDto> load(Pageable pageable, Long cursorId) {
        // Infinite Scroll 전략에서는 pageable의 page number를 사용하지 않고, size만 사용합니다.
        int pageSize = pageable.getPageSize();

        // cursorId가 없으면 첫 페이지로 간주하고 가장 큰 ID 값으로 설정
        Long currentCursorId = (cursorId == null || cursorId == 0) ? FIRSTPAGE_CURSOR : cursorId;

        List<Board> boards = boardRepository.findByIdLessThanOrderByIdDesc(
                currentCursorId,
                PageRequest.of(0, pageSize) // 항상 첫번째 페이지에서 size만큼 가져오도록 설정
        );
        return boards.stream()
                .map(BoardResDto::from)
                .collect(Collectors.toList());

    }
}