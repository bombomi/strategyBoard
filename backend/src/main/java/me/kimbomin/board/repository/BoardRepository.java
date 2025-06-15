package me.kimbomin.board.repository;

import me.kimbomin.board.domain.Board;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // 무한 스크롤을 위한 쿼리 메소드
    // id가 cursorId보다 작은 게시물들을 id 내림차순으로 정렬하여 size만큼 조회
    List<Board> findByIdLessThanOrderByIdDesc(Long cursorId, Pageable pageable);
}
