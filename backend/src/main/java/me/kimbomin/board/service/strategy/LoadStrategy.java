package me.kimbomin.board.service.strategy;

import me.kimbomin.board.dto.BoardResDto;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface LoadStrategy {

    /* 게시글을 로드하는 공통 메소드
     * @param pageable Spring Data의 페이징 정보 (페이지 번호, 페이지 크기, 정렬 등)
     * @param cursorId 무한 스크롤에서 마지막으로 로드된 게시글의 ID
     * @return 게시글 DTO 리스트
     */
    List<BoardResDto> load(Pageable pageable, Long cursorId);

    // 각 전략의 이름을 반환
    String getStrategyNm();
}
